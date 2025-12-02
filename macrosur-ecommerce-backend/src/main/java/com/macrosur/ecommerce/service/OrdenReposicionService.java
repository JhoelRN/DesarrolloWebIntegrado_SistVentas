package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.dto.*;
import com.macrosur.ecommerce.entity.*;
import com.macrosur.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrdenReposicionService {
    
    private final OrdenReposicionRepository ordenReposicionRepository;
    private final DetalleOrdenReposicionRepository detalleOrdenReposicionRepository;
    private final ProveedorRepository proveedorRepository;
    private final VarianteProductoRepository varianteProductoRepository;
    private final InventarioRepository inventarioRepository;
    private final MovimientoStockRepository movimientoStockRepository;
    private final UbicacionInventarioRepository ubicacionInventarioRepository;
    private final AlarmaStockRepository alarmaStockRepository;
    
    /**
     * Crear orden de reposición manual o automática
     */
    @Transactional
    public OrdenReposicionDTO crearOrdenReposicion(CrearOrdenReposicionDTO crearDTO) {
        Proveedor proveedor = proveedorRepository.findById(crearDTO.getProveedorId())
            .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        
        OrdenReposicion orden = new OrdenReposicion();
        orden.setProveedor(proveedor);
        orden.setFechaSolicitud(LocalDateTime.now());
        orden.setEstadoAutorizacion(OrdenReposicion.EstadoAutorizacion.PENDIENTE);
        
        BigDecimal costoTotal = BigDecimal.ZERO;
        
        for (CrearOrdenReposicionDTO.DetalleOrdenItemDTO item : crearDTO.getItems()) {
            VarianteProducto variante = varianteProductoRepository.findById(item.getVarianteId())
                .orElseThrow(() -> new RuntimeException("Variante no encontrada"));
            
            DetalleOrdenReposicion detalle = new DetalleOrdenReposicion();
            detalle.setOrdenReposicion(orden);
            detalle.setVariante(variante);
            detalle.setCantidadPedida(item.getCantidadPedida());
            detalle.setCostoUnitario(variante.getPrecioBase()); // Se puede ajustar con precio de proveedor
            
            orden.getDetalles().add(detalle);
            
            BigDecimal subtotal = detalle.getCostoUnitario().multiply(new BigDecimal(detalle.getCantidadPedida()));
            costoTotal = costoTotal.add(subtotal);
        }
        
        orden.setCostoTotal(costoTotal);
        orden = ordenReposicionRepository.save(orden);
        
        return convertirAOrdenReposicionDTO(orden);
    }
    
    /**
     * Obtener todas las órdenes
     */
    public List<OrdenReposicionDTO> obtenerTodasLasOrdenes() {
        List<OrdenReposicion> ordenes = ordenReposicionRepository.findAllByOrderByFechaSolicitudDesc();
        return ordenes.stream()
            .map(this::convertirAOrdenReposicionDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener órdenes por estado
     */
    public List<OrdenReposicionDTO> obtenerOrdenesPorEstado(String estado) {
        OrdenReposicion.EstadoAutorizacion estadoEnum = OrdenReposicion.EstadoAutorizacion.valueOf(estado.toUpperCase());
        List<OrdenReposicion> ordenes = ordenReposicionRepository.findByEstadoAutorizacionOrderByFechaSolicitudDesc(estadoEnum);
        return ordenes.stream()
            .map(this::convertirAOrdenReposicionDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Autorizar orden de reposición
     */
    @Transactional
    public OrdenReposicionDTO autorizarOrden(Integer ordenId, Integer usuarioAdminId) {
        OrdenReposicion orden = ordenReposicionRepository.findById(ordenId)
            .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        
        if (orden.getEstadoAutorizacion() != OrdenReposicion.EstadoAutorizacion.PENDIENTE) {
            throw new RuntimeException("La orden no está en estado pendiente");
        }
        
        orden.setEstadoAutorizacion(OrdenReposicion.EstadoAutorizacion.AUTORIZADA);
        orden.setFechaAutorizacion(LocalDateTime.now());
        // TODO: Setear usuario que autoriza cuando esté disponible
        
        orden = ordenReposicionRepository.save(orden);
        
        return convertirAOrdenReposicionDTO(orden);
    }
    
    /**
     * Rechazar orden de reposición
     */
    @Transactional
    public OrdenReposicionDTO rechazarOrden(Integer ordenId) {
        OrdenReposicion orden = ordenReposicionRepository.findById(ordenId)
            .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        
        orden.setEstadoAutorizacion(OrdenReposicion.EstadoAutorizacion.RECHAZADA);
        orden = ordenReposicionRepository.save(orden);
        
        return convertirAOrdenReposicionDTO(orden);
    }
    
    /**
     * Recibir mercancía (confirmar cantidades recibidas)
     */
    @Transactional
    public OrdenReposicionDTO recibirMercancia(RecepcionOrdenDTO recepcionDTO) {
        OrdenReposicion orden = ordenReposicionRepository.findById(recepcionDTO.getOrdenReposicionId())
            .orElseThrow(() -> new RuntimeException("Orden no encontrada"));
        
        if (orden.getEstadoAutorizacion() != OrdenReposicion.EstadoAutorizacion.AUTORIZADA) {
            throw new RuntimeException("La orden no está autorizada");
        }
        
        // Buscar ubicaciones: Tienda Física y Almacén Central
        UbicacionInventario ubicacionTienda = ubicacionInventarioRepository.findByEsFisica(true).stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("No se encontró ubicación de tienda física"));
        
        UbicacionInventario ubicacionAlmacen = ubicacionInventarioRepository.findByEsFisica(false).stream()
            .findFirst()
            .orElseThrow(() -> new RuntimeException("No se encontró ubicación de almacén"));
        
        int totalRecibido = 0;
        
        for (RecepcionOrdenDTO.RecepcionItemDTO item : recepcionDTO.getItems()) {
            DetalleOrdenReposicion detalle = detalleOrdenReposicionRepository.findById(item.getDetalleOrdenId())
                .orElseThrow(() -> new RuntimeException("Detalle de orden no encontrado"));
            
            detalle.setCantidadRecibida(item.getCantidadRecibida());
            detalleOrdenReposicionRepository.save(detalle);
            
            totalRecibido += item.getCantidadRecibida();
            
            // Lógica de distribución inteligente
            // 1. Verificar stock actual en tienda
            Inventario inventarioTienda = inventarioRepository.findByVarianteAndUbicacion(
                detalle.getVariante(),
                ubicacionTienda
            ).orElse(null);
            
            int stockTienda = (inventarioTienda != null) ? inventarioTienda.getCantidad() : 0;
            int stockMinimo = (inventarioTienda != null) ? inventarioTienda.getStockMinimoSeguridad() : 10;
            
            int cantidadRecibida = item.getCantidadRecibida();
            int cantidadParaTienda;
            int cantidadParaAlmacen;
            
            // 2. Si stock en tienda < mínimo, priorizar llenar hasta el mínimo
            if (stockTienda < stockMinimo) {
                int diferencia = stockMinimo - stockTienda;
                cantidadParaTienda = Math.min(cantidadRecibida, diferencia);
                cantidadParaAlmacen = cantidadRecibida - cantidadParaTienda;
            } else {
                // 3. Si stock >= mínimo, distribuir 30% tienda, 70% almacén
                cantidadParaTienda = (int) Math.ceil(cantidadRecibida * 0.30);
                cantidadParaAlmacen = cantidadRecibida - cantidadParaTienda;
            }
            
            // Actualizar inventario en TIENDA
            if (cantidadParaTienda > 0) {
                if (inventarioTienda == null) {
                    inventarioTienda = new Inventario();
                    inventarioTienda.setVariante(detalle.getVariante());
                    inventarioTienda.setUbicacion(ubicacionTienda);
                    inventarioTienda.setCantidad(0);
                    inventarioTienda.setStockMinimoSeguridad(stockMinimo);
                }
                
                inventarioTienda.setCantidad(inventarioTienda.getCantidad() + cantidadParaTienda);
                inventarioTienda = inventarioRepository.save(inventarioTienda);
                
                // Registrar movimiento en TIENDA
                MovimientoStock movimientoTienda = new MovimientoStock();
                movimientoTienda.setInventario(inventarioTienda);
                movimientoTienda.setCantidad(cantidadParaTienda);
                movimientoTienda.setTipoMovimiento(MovimientoStock.TipoMovimiento.ENTRADA_COMPRA);
                movimientoTienda.setMotivo("Recepción orden #" + orden.getOrdenReposicionId() + 
                    " - Distribución a Tienda (" + cantidadParaTienda + " uds)");
                movimientoTienda.setFechaMovimiento(LocalDateTime.now());
                movimientoStockRepository.save(movimientoTienda);
                
                // Resolver alarmas de tienda si existen
                final Inventario finalInventarioTienda = inventarioTienda;
                alarmaStockRepository.findByInventarioAndResuelta(finalInventarioTienda, false)
                    .ifPresent(alarma -> {
                        if (finalInventarioTienda.getCantidad() >= finalInventarioTienda.getStockMinimoSeguridad()) {
                            alarma.setResuelta(true);
                            alarma.setFechaResolucion(LocalDateTime.now());
                            alarmaStockRepository.save(alarma);
                        }
                    });
            }
            
            // Actualizar inventario en ALMACÉN
            if (cantidadParaAlmacen > 0) {
                Inventario inventarioAlmacen = inventarioRepository.findByVarianteAndUbicacion(
                    detalle.getVariante(),
                    ubicacionAlmacen
                ).orElse(null);
                
                if (inventarioAlmacen == null) {
                    inventarioAlmacen = new Inventario();
                    inventarioAlmacen.setVariante(detalle.getVariante());
                    inventarioAlmacen.setUbicacion(ubicacionAlmacen);
                    inventarioAlmacen.setCantidad(0);
                    inventarioAlmacen.setStockMinimoSeguridad(stockMinimo * 2); // Almacén tiene mayor stock mínimo
                }
                
                inventarioAlmacen.setCantidad(inventarioAlmacen.getCantidad() + cantidadParaAlmacen);
                inventarioAlmacen = inventarioRepository.save(inventarioAlmacen);
                
                // Registrar movimiento en ALMACÉN
                MovimientoStock movimientoAlmacen = new MovimientoStock();
                movimientoAlmacen.setInventario(inventarioAlmacen);
                movimientoAlmacen.setCantidad(cantidadParaAlmacen);
                movimientoAlmacen.setTipoMovimiento(MovimientoStock.TipoMovimiento.ENTRADA_COMPRA);
                movimientoAlmacen.setMotivo("Recepción orden #" + orden.getOrdenReposicionId() + 
                    " - Distribución a Almacén (" + cantidadParaAlmacen + " uds)");
                movimientoAlmacen.setFechaMovimiento(LocalDateTime.now());
                movimientoStockRepository.save(movimientoAlmacen);
                
                // Resolver alarmas de almacén si existen
                final Inventario finalInventarioAlmacen = inventarioAlmacen;
                alarmaStockRepository.findByInventarioAndResuelta(finalInventarioAlmacen, false)
                    .ifPresent(alarma -> {
                        if (finalInventarioAlmacen.getCantidad() >= finalInventarioAlmacen.getStockMinimoSeguridad()) {
                            alarma.setResuelta(true);
                            alarma.setFechaResolucion(LocalDateTime.now());
                            alarmaStockRepository.save(alarma);
                        }
                    });
            }
        }
        
        orden.setEstadoAutorizacion(OrdenReposicion.EstadoAutorizacion.RECIBIDA);
        orden.setFechaRecepcion(LocalDateTime.now());
        orden = ordenReposicionRepository.save(orden);
        
        return convertirAOrdenReposicionDTO(orden);
    }
    
    /**
     * Generar órdenes automáticas cuando stock < umbral
     * Sistema INTELIGENTE que aprende de órdenes históricas
     * Se ejecuta cada 6 horas: 2 AM, 8 AM, 2 PM, 8 PM
     */
    @Scheduled(cron = "0 0 2,8,14,20 * * *")
    @Transactional
    public void generarOrdenesAutomaticas() {
        List<Inventario> stocksBajos = inventarioRepository.findStockBajo();
        
        if (stocksBajos.isEmpty()) {
            return;
        }
        
        // Agrupar variantes por proveedor usando lógica inteligente
        Map<Integer, List<Inventario>> variantesPorProveedor = agruparPorProveedorInteligente(stocksBajos);
        
        // Crear una orden por cada proveedor
        for (Map.Entry<Integer, List<Inventario>> entry : variantesPorProveedor.entrySet()) {
            Integer proveedorId = entry.getKey();
            List<Inventario> variantes = entry.getValue();
            
            // Verificar que el proveedor existe
            Proveedor proveedor = proveedorRepository.findById(proveedorId).orElse(null);
            if (proveedor == null) {
                continue;
            }
            
            CrearOrdenReposicionDTO crearDTO = new CrearOrdenReposicionDTO();
            crearDTO.setProveedorId(proveedorId);
            
            List<CrearOrdenReposicionDTO.DetalleOrdenItemDTO> items = variantes.stream()
                .map(inv -> {
                    // Calcular cantidad sugerida (stock mínimo × 2 - stock actual)
                    int cantidadSugerida = Math.max(
                        inv.getStockMinimoSeguridad() * 2 - inv.getCantidad(), 
                        inv.getStockMinimoSeguridad()
                    );
                    
                    CrearOrdenReposicionDTO.DetalleOrdenItemDTO item = 
                        new CrearOrdenReposicionDTO.DetalleOrdenItemDTO();
                    item.setVarianteId(inv.getVariante().getVarianteId());
                    item.setCantidadPedida(cantidadSugerida);
                    return item;
                })
                .collect(Collectors.toList());
            
            crearDTO.setItems(items);
            
            // Crear orden automática
            try {
                crearOrdenReposicion(crearDTO);
                System.out.println("✅ Orden automática creada para proveedor: " + proveedor.getNombre() + 
                    " (" + items.size() + " productos)");
            } catch (Exception e) {
                System.err.println("❌ Error al crear orden automática para proveedor " + 
                    proveedorId + ": " + e.getMessage());
            }
        }
    }
    
    /**
     * Sistema inteligente: Aprende de órdenes históricas para asignar proveedores
     * Lógica:
     * 1. Buscar en historial de órdenes qué proveedor ha surtido esta variante
     * 2. Usar el proveedor más frecuente
     * 3. Si no hay historial, asignar a proveedor por defecto (ID 1)
     */
    private Map<Integer, List<Inventario>> agruparPorProveedorInteligente(List<Inventario> stocksBajos) {
        Map<Integer, List<Inventario>> resultado = new HashMap<>();
        
        for (Inventario inventario : stocksBajos) {
            Integer varianteId = inventario.getVariante().getVarianteId();
            
            // Buscar proveedor en historial de órdenes
            Integer proveedorAprendido = aprenderProveedorDeHistorial(varianteId);
            
            // Si no hay historial, usar proveedor predeterminado
            Integer proveedorAsignado = (proveedorAprendido != null) ? proveedorAprendido : 1;
            
            // Agrupar por proveedor
            resultado.computeIfAbsent(proveedorAsignado, k -> new ArrayList<>()).add(inventario);
        }
        
        return resultado;
    }
    
    /**
     * Aprende el proveedor más frecuente para una variante específica
     * basándose en órdenes históricas RECIBIDAS (estado = RECIBIDA)
     */
    private Integer aprenderProveedorDeHistorial(Integer varianteId) {
        // Buscar todas las órdenes RECIBIDAS que contienen esta variante
        List<OrdenReposicion> ordenesRecibidas = ordenReposicionRepository
            .findByEstadoAutorizacionOrderByFechaSolicitudDesc(OrdenReposicion.EstadoAutorizacion.RECIBIDA);
        
        // Contar frecuencia de cada proveedor para esta variante
        Map<Integer, Long> frecuenciaProveedores = ordenesRecibidas.stream()
            .filter(orden -> orden.getDetalles().stream()
                .anyMatch(detalle -> detalle.getVariante().getVarianteId().equals(varianteId)))
            .collect(Collectors.groupingBy(
                orden -> orden.getProveedor().getProveedorId(),
                Collectors.counting()
            ));
        
        // Devolver el proveedor más frecuente
        return frecuenciaProveedores.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse(null);
    }
    
    /**
     * Convertir OrdenReposicion a DTO
     */
    private OrdenReposicionDTO convertirAOrdenReposicionDTO(OrdenReposicion orden) {
        OrdenReposicionDTO dto = new OrdenReposicionDTO();
        dto.setOrdenReposicionId(orden.getOrdenReposicionId());
        dto.setProveedorId(orden.getProveedor().getProveedorId());
        dto.setNombreProveedor(orden.getProveedor().getNombre());
        dto.setContactoProveedor(orden.getProveedor().getContacto());
        dto.setFechaSolicitud(orden.getFechaSolicitud());
        dto.setFechaAutorizacion(orden.getFechaAutorizacion());
        dto.setEstadoAutorizacion(orden.getEstadoAutorizacion().getDescripcion());
        dto.setCostoTotal(orden.getCostoTotal());
        dto.setFechaRecepcion(orden.getFechaRecepcion());
        
        if (orden.getUsuarioAutoriza() != null) {
            dto.setUsuarioAutorizaId(orden.getUsuarioAutoriza().getUsuario_admin_id().intValue());
            dto.setNombreUsuarioAutoriza(orden.getUsuarioAutoriza().getNombre() + " " + 
                orden.getUsuarioAutoriza().getApellido());
        }
        
        List<DetalleOrdenReposicionDTO> detallesDTO = orden.getDetalles().stream()
            .map(this::convertirADetalleDTO)
            .collect(Collectors.toList());
        dto.setDetalles(detallesDTO);
        
        return dto;
    }
    
    private DetalleOrdenReposicionDTO convertirADetalleDTO(DetalleOrdenReposicion detalle) {
        DetalleOrdenReposicionDTO dto = new DetalleOrdenReposicionDTO();
        dto.setDetalleOrdenId(detalle.getDetalleOrdenId());
        dto.setVarianteId(detalle.getVariante().getVarianteId());
        dto.setSku(detalle.getVariante().getSku());
        dto.setNombreProducto(detalle.getVariante().getProducto().getNombreProducto());
        dto.setUrlImagen(detalle.getVariante().getUrlImagenPrincipal());
        dto.setCantidadPedida(detalle.getCantidadPedida());
        dto.setCantidadRecibida(detalle.getCantidadRecibida());
        dto.setCostoUnitario(detalle.getCostoUnitario());
        
        if (detalle.getCostoUnitario() != null) {
            dto.setSubtotal(detalle.getCostoUnitario().multiply(new BigDecimal(detalle.getCantidadPedida())));
        }
        
        return dto;
    }
}
