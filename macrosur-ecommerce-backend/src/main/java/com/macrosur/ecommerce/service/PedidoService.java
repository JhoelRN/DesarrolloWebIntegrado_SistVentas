package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.dto.CrearPedidoDTO;
import com.macrosur.ecommerce.dto.PedidoResponseDTO;
import com.macrosur.ecommerce.entity.*;
import com.macrosur.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoService {
    
    private static final Logger logger = LoggerFactory.getLogger(PedidoService.class);
    private static final BigDecimal IVA_RATE = new BigDecimal("0.19");
    
    private final PedidoRepository pedidoRepository;
    private final InventarioRepository inventarioRepository;
    private final VarianteProductoRepository varianteRepository;
    private final MovimientoStockRepository movimientoRepository;
    private final SeguimientoDespachoRepository seguimientoRepository;
    private final InventarioService inventarioService;
    
    /**
     * Crear pedido desde carrito de compras
     * - Valida stock disponible
     * - Descuenta inventario automáticamente
     * - Crea movimientos de stock
     * - Gestiona alarmas de stock bajo
     */
    @Transactional
    public PedidoResponseDTO crearPedido(CrearPedidoDTO crearDTO) {
        logger.info("🛒 Creando pedido para cliente ID: {}", crearDTO.getClienteId());
        
        // 1. Validar disponibilidad de stock
        validarStockDisponible(crearDTO.getItems());
        
        // 2. Calcular totales
        BigDecimal totalNeto = calcularTotalNeto(crearDTO.getItems());
        BigDecimal totalImpuestos = totalNeto.multiply(IVA_RATE);
        BigDecimal totalDescuento = calcularTotalDescuentos(crearDTO.getItems());
        BigDecimal totalFinal = totalNeto.add(totalImpuestos).add(crearDTO.getTotalEnvio()).subtract(totalDescuento);
        
        // 3. Crear pedido
        Pedido pedido = new Pedido();
        pedido.setClienteId(crearDTO.getClienteId());
        pedido.setEstado(Pedido.EstadoPedido.PENDIENTE_PAGO);
        pedido.setMetodoEntrega(Pedido.MetodoEntrega.valueOf(crearDTO.getMetodoEntrega()));
        pedido.setDireccionEnvioId(crearDTO.getDireccionEnvioId());
        pedido.setUbicacionRetiroId(crearDTO.getUbicacionRetiroId());
        pedido.setTotalNeto(totalNeto);
        pedido.setTotalImpuestos(totalImpuestos);
        pedido.setTotalEnvio(crearDTO.getTotalEnvio());
        pedido.setTotalDescuento(totalDescuento);
        pedido.setTotalFinal(totalFinal);
        
        // 4. Crear detalles y descontar stock
        List<DetallePedido> detalles = new ArrayList<>();
        for (CrearPedidoDTO.DetallePedidoDTO itemDTO : crearDTO.getItems()) {
            VarianteProducto variante = varianteRepository.findById(itemDTO.getVarianteId())
                .orElseThrow(() -> new RuntimeException("Variante no encontrada: " + itemDTO.getVarianteId()));
            
            BigDecimal subtotal = itemDTO.getPrecioUnitario()
                .multiply(BigDecimal.valueOf(itemDTO.getCantidad()))
                .subtract(itemDTO.getDescuentoAplicado() != null ? itemDTO.getDescuentoAplicado() : BigDecimal.ZERO);
            
            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setVariante(variante);
            detalle.setPrecioUnitario(itemDTO.getPrecioUnitario());
            detalle.setCantidad(itemDTO.getCantidad());
            detalle.setDescuentoAplicado(itemDTO.getDescuentoAplicado());
            detalle.setSubtotal(subtotal);
            
            // Descontar stock (priorizar Tienda Física ID=4)
            Inventario inventarioOrigen = descontarStock(variante.getVarianteId(), itemDTO.getCantidad());
            detalle.setUbicacionStockOrigen(inventarioOrigen.getUbicacion().getUbicacionId());
            
            detalles.add(detalle);
        }
        
        pedido.setDetalles(detalles);
        pedido = pedidoRepository.save(pedido);
        
        logger.info("✅ Pedido creado: ID={}, Total=${}, Items={}", 
            pedido.getPedidoId(), pedido.getTotalFinal(), detalles.size());
        
        return convertirAPedidoDTO(pedido);
    }
    
    /**
     * Validar que hay stock suficiente para todos los items
     */
    private void validarStockDisponible(List<CrearPedidoDTO.DetallePedidoDTO> items) {
        for (CrearPedidoDTO.DetallePedidoDTO item : items) {
            VarianteProducto variante = varianteRepository.findById(item.getVarianteId())
                .orElseThrow(() -> new RuntimeException("Variante no encontrada"));
            
            int stockTotal = inventarioRepository.findByVariante(variante)
                .stream()
                .mapToInt(Inventario::getCantidad)
                .sum();
            
            if (stockTotal < item.getCantidad()) {
                throw new RuntimeException(String.format(
                    "Stock insuficiente para %s (SKU: %s). Disponible: %d, Solicitado: %d",
                    variante.getProducto().getNombreProducto(),
                    variante.getSku(),
                    stockTotal,
                    item.getCantidad()
                ));
            }
        }
    }
    
    /**
     * Descontar stock de inventario (priorizar Tienda Física)
     */
    private Inventario descontarStock(Integer varianteId, Integer cantidadRequerida) {
        VarianteProducto variante = varianteRepository.findById(varianteId)
            .orElseThrow(() -> new RuntimeException("Variante no encontrada"));
        
        List<Inventario> inventarios = inventarioRepository.findByVariante(variante);
        
        // Priorizar Tienda Física (ID=4), luego Almacén Central (ID=5)
        inventarios.sort((i1, i2) -> {
            if (i1.getUbicacion().getUbicacionId().equals(4)) return -1;
            if (i2.getUbicacion().getUbicacionId().equals(4)) return 1;
            if (i1.getUbicacion().getUbicacionId().equals(5)) return -1;
            if (i2.getUbicacion().getUbicacionId().equals(5)) return 1;
            return 0;
        });
        
        int cantidadRestante = cantidadRequerida;
        Inventario inventarioOrigen = inventarios.get(0);
        
        for (Inventario inventario : inventarios) {
            if (cantidadRestante == 0) break;
            
            int disponible = inventario.getCantidad();
            int aDescontar = Math.min(disponible, cantidadRestante);
            
            if (aDescontar > 0) {
                inventario.setCantidad(disponible - aDescontar);
                inventarioRepository.save(inventario);
                
                // Crear movimiento de stock
                MovimientoStock movimiento = new MovimientoStock();
                movimiento.setInventario(inventario);
                movimiento.setTipoMovimiento(MovimientoStock.TipoMovimiento.SALIDA_VENTA);
                movimiento.setCantidad(-aDescontar);
                movimiento.setMotivo("Venta - Pedido de cliente");
                movimiento.setFechaMovimiento(LocalDateTime.now());
                movimientoRepository.save(movimiento);
                
                cantidadRestante -= aDescontar;
                
                logger.info("📦 Stock descontado: Variante={}, Ubicación={}, Cantidad={}, Restante={}", 
                    varianteId, inventario.getUbicacion().getNombreUbicacion(), aDescontar, inventario.getCantidad());
            }
        }
        
        return inventarioOrigen;
    }
    
    /**
     * Calcular total neto (suma de subtotales sin impuestos)
     */
    private BigDecimal calcularTotalNeto(List<CrearPedidoDTO.DetallePedidoDTO> items) {
        return items.stream()
            .map(item -> item.getPrecioUnitario().multiply(BigDecimal.valueOf(item.getCantidad())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    /**
     * Calcular total de descuentos aplicados
     */
    private BigDecimal calcularTotalDescuentos(List<CrearPedidoDTO.DetallePedidoDTO> items) {
        return items.stream()
            .map(item -> item.getDescuentoAplicado() != null ? item.getDescuentoAplicado() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    /**
     * Obtener todos los pedidos (Admin)
     */
    public List<PedidoResponseDTO> obtenerTodosLosPedidos() {
        return pedidoRepository.findAllByOrderByFechaPedidoDesc().stream()
            .map(this::convertirAPedidoDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener pedidos de un cliente
     */
    public List<PedidoResponseDTO> obtenerPedidosPorCliente(Long clienteId) {
        return pedidoRepository.findByClienteIdOrderByFechaPedidoDesc(clienteId).stream()
            .map(this::convertirAPedidoDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener pedido por ID
     */
    public PedidoResponseDTO obtenerPedidoPorId(Long pedidoId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        return convertirAPedidoDTO(pedido);
    }
    
    /**
     * Actualizar estado de pedido
     */
    @Transactional
    public PedidoResponseDTO actualizarEstadoPedido(Long pedidoId, String nuevoEstado) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        pedido.setEstado(Pedido.EstadoPedido.valueOf(nuevoEstado));
        pedido = pedidoRepository.save(pedido);
        
        logger.info("🔄 Estado actualizado: Pedido={}, Estado={}", pedidoId, nuevoEstado);
        
        return convertirAPedidoDTO(pedido);
    }
    
    /**
     * Convertir Pedido entity a DTO
     */
    private PedidoResponseDTO convertirAPedidoDTO(Pedido pedido) {
        PedidoResponseDTO dto = new PedidoResponseDTO();
        dto.setPedidoId(pedido.getPedidoId());
        dto.setClienteId(pedido.getClienteId());
        dto.setFechaPedido(pedido.getFechaPedido());
        dto.setEstado(pedido.getEstado().getDescripcion());
        dto.setTotalNeto(pedido.getTotalNeto());
        dto.setTotalImpuestos(pedido.getTotalImpuestos());
        dto.setTotalEnvio(pedido.getTotalEnvio());
        dto.setTotalDescuento(pedido.getTotalDescuento());
        dto.setTotalFinal(pedido.getTotalFinal());
        dto.setMetodoEntrega(pedido.getMetodoEntrega().getDescripcion());
        dto.setDireccionEnvioId(pedido.getDireccionEnvioId());
        dto.setUbicacionRetiroId(pedido.getUbicacionRetiroId());
        
        // Detalles
        List<PedidoResponseDTO.DetallePedidoResponseDTO> detalles = pedido.getDetalles().stream()
            .map(detalle -> {
                PedidoResponseDTO.DetallePedidoResponseDTO detalleDTO = new PedidoResponseDTO.DetallePedidoResponseDTO();
                detalleDTO.setDetallePedidoId(detalle.getDetallePedidoId());
                detalleDTO.setVarianteId(detalle.getVariante().getVarianteId());
                detalleDTO.setNombreProducto(detalle.getVariante().getProducto().getNombreProducto());
                detalleDTO.setNombreVariante(detalle.getVariante().getSku());
                detalleDTO.setSku(detalle.getVariante().getSku());
                detalleDTO.setPrecioUnitario(detalle.getPrecioUnitario());
                detalleDTO.setCantidad(detalle.getCantidad());
                detalleDTO.setDescuentoAplicado(detalle.getDescuentoAplicado());
                detalleDTO.setSubtotal(detalle.getSubtotal());
                return detalleDTO;
            })
            .collect(Collectors.toList());
        dto.setDetalles(detalles);
        
        // Seguimiento (si existe)
        seguimientoRepository.findByPedidoId(pedido.getPedidoId()).ifPresent(seguimiento -> {
            PedidoResponseDTO.SeguimientoInfoDTO seguimientoDTO = new PedidoResponseDTO.SeguimientoInfoDTO();
            seguimientoDTO.setSeguimientoId(seguimiento.getSeguimientoDespachoId());
            seguimientoDTO.setNumeroGuia(seguimiento.getNumeroGuia());
            seguimientoDTO.setEstadoEnvio(seguimiento.getEstadoEnvio().getDescripcion());
            seguimientoDTO.setNombreOperador(seguimiento.getOperador().getNombre());
            seguimientoDTO.setUrlRastreoCompleta(
                seguimiento.getOperador().getUrlRastreoBase() + seguimiento.getNumeroGuia()
            );
            seguimientoDTO.setFechaDespacho(seguimiento.getFechaDespacho());
            seguimientoDTO.setFechaEntrega(seguimiento.getFechaEntrega());
            dto.setSeguimiento(seguimientoDTO);
        });
        
        return dto;
    }
}
