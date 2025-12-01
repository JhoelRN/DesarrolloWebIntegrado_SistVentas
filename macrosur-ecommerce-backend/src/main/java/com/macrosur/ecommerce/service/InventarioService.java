package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.dto.*;
import com.macrosur.ecommerce.entity.*;
import com.macrosur.ecommerce.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InventarioService {
    
    private final InventarioRepository inventarioRepository;
    private final VarianteProductoRepository varianteProductoRepository;
    private final UbicacionInventarioRepository ubicacionInventarioRepository;
    private final MovimientoStockRepository movimientoStockRepository;
    private final AlarmaStockRepository alarmaStockRepository;
    
    /**
     * Obtener todo el inventario con información de alarmas
     */
    @Transactional(readOnly = true)
    public List<InventarioDTO> obtenerInventarioCompleto() {
        List<Inventario> inventarios = inventarioRepository.findAll();
        return inventarios.stream()
            .map(this::convertirAInventarioDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener inventario por ubicación
     */
    @Transactional(readOnly = true)
    public List<InventarioDTO> obtenerInventarioPorUbicacion(Integer ubicacionId) {
        UbicacionInventario ubicacion = ubicacionInventarioRepository.findById(ubicacionId)
            .orElseThrow(() -> new RuntimeException("Ubicación no encontrada"));
        
        List<Inventario> inventarios = inventarioRepository.findByUbicacion(ubicacion);
        return inventarios.stream()
            .map(this::convertirAInventarioDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener inventario por variante (todas las ubicaciones)
     */
    @Transactional(readOnly = true)
    public List<InventarioDTO> obtenerInventarioPorVariante(Integer varianteId) {
        VarianteProducto variante = varianteProductoRepository.findById(varianteId)
            .orElseThrow(() -> new RuntimeException("Variante no encontrada"));
        List<Inventario> inventarios = inventarioRepository.findByVariante(variante);
        return inventarios.stream()
            .map(this::convertirAInventarioDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Ajustar inventario manualmente (correcciones, mermas)
     */
    @Transactional
    public InventarioDTO ajustarInventario(AjusteInventarioDTO ajusteDTO) {
        VarianteProducto variante = varianteProductoRepository.findById(ajusteDTO.getVarianteId())
            .orElseThrow(() -> new RuntimeException("Variante no encontrada"));
        
        UbicacionInventario ubicacion = ubicacionInventarioRepository.findById(ajusteDTO.getUbicacionId())
            .orElseThrow(() -> new RuntimeException("Ubicación no encontrada"));
        
        // Buscar o crear registro de inventario
        Inventario inventario = inventarioRepository.findByVarianteAndUbicacion(variante, ubicacion)
            .orElse(new Inventario());
        
        if (inventario.getInventarioId() == null) {
            inventario.setVariante(variante);
            inventario.setUbicacion(ubicacion);
            inventario.setCantidad(0);
            inventario.setStockMinimoSeguridad(calcularStockMinimoAutomatico(variante));
        }
        
        // Aplicar ajuste
        inventario.setCantidad(inventario.getCantidad() + ajusteDTO.getCantidadAjuste());
        inventario = inventarioRepository.save(inventario);
        
        // Registrar movimiento
        MovimientoStock movimiento = new MovimientoStock();
        movimiento.setInventario(inventario);
        movimiento.setCantidad(Math.abs(ajusteDTO.getCantidadAjuste()));
        movimiento.setTipoMovimiento(MovimientoStock.TipoMovimiento.AJUSTE);
        movimiento.setMotivo("Ajuste manual de inventario");
        movimiento.setFechaMovimiento(LocalDateTime.now());
        movimientoStockRepository.save(movimiento);
        
        // Verificar y crear/resolver alarmas
        verificarYGestionarAlarmas(inventario);
        
        return convertirAInventarioDTO(inventario);
    }
    
    /**
     * Transferir stock entre ubicaciones
     */
    @Transactional
    public void transferirStock(TransferenciaStockDTO transferenciaDTO) {
        VarianteProducto variante = varianteProductoRepository.findById(transferenciaDTO.getVarianteId())
            .orElseThrow(() -> new RuntimeException("Variante no encontrada"));
        
        UbicacionInventario origen = ubicacionInventarioRepository.findById(transferenciaDTO.getUbicacionOrigenId())
            .orElseThrow(() -> new RuntimeException("Ubicación origen no encontrada"));
        
        UbicacionInventario destino = ubicacionInventarioRepository.findById(transferenciaDTO.getUbicacionDestinoId())
            .orElseThrow(() -> new RuntimeException("Ubicación destino no encontrada"));
        
        // Buscar inventario origen
        Inventario inventarioOrigen = inventarioRepository.findByVarianteAndUbicacion(variante, origen)
            .orElseThrow(() -> new RuntimeException("No hay inventario en ubicación origen"));
        
        if (inventarioOrigen.getCantidad() < transferenciaDTO.getCantidad()) {
            throw new RuntimeException("Stock insuficiente en ubicación origen");
        }
        
        // Reducir stock en origen
        inventarioOrigen.setCantidad(inventarioOrigen.getCantidad() - transferenciaDTO.getCantidad());
        inventarioRepository.save(inventarioOrigen);
        
        // Aumentar stock en destino
        Inventario inventarioDestino = inventarioRepository.findByVarianteAndUbicacion(variante, destino)
            .orElse(new Inventario());
        
        if (inventarioDestino.getInventarioId() == null) {
            inventarioDestino.setVariante(variante);
            inventarioDestino.setUbicacion(destino);
            inventarioDestino.setCantidad(0);
            inventarioDestino.setStockMinimoSeguridad(calcularStockMinimoAutomatico(variante));
        }
        
        inventarioDestino.setCantidad(inventarioDestino.getCantidad() + transferenciaDTO.getCantidad());
        inventarioRepository.save(inventarioDestino);
        
        // Registrar movimiento de salida en origen
        MovimientoStock movimientoSalida = new MovimientoStock();
        movimientoSalida.setInventario(inventarioOrigen);
        movimientoSalida.setCantidad(transferenciaDTO.getCantidad());
        movimientoSalida.setTipoMovimiento(MovimientoStock.TipoMovimiento.TRANSFERENCIA);
        movimientoSalida.setMotivo("Transferencia a " + destino.getNombreUbicacion());
        movimientoSalida.setFechaMovimiento(LocalDateTime.now());
        movimientoSalida.setPedidoId(transferenciaDTO.getPedidoId());
        movimientoStockRepository.save(movimientoSalida);
        
        // Registrar movimiento de entrada en destino
        MovimientoStock movimientoEntrada = new MovimientoStock();
        movimientoEntrada.setInventario(inventarioDestino);
        movimientoEntrada.setCantidad(transferenciaDTO.getCantidad());
        movimientoEntrada.setTipoMovimiento(MovimientoStock.TipoMovimiento.TRANSFERENCIA);
        movimientoEntrada.setMotivo("Transferencia desde " + origen.getNombreUbicacion());
        movimientoEntrada.setFechaMovimiento(LocalDateTime.now());
        movimientoEntrada.setPedidoId(transferenciaDTO.getPedidoId());
        movimientoStockRepository.save(movimientoEntrada);
        
        // Verificar alarmas en ambas ubicaciones
        verificarYGestionarAlarmas(inventarioOrigen);
        verificarYGestionarAlarmas(inventarioDestino);
    }
    
    /**
     * Calcular stock mínimo automático basado en velocidad de venta (últimos 30 días)
     */
    private Integer calcularStockMinimoAutomatico(VarianteProducto variante) {
        LocalDateTime hace30Dias = LocalDateTime.now().minusDays(30);
        Integer ventasTotales = movimientoStockRepository.calcularVelocidadVenta(variante, hace30Dias);
        
        if (ventasTotales == null || ventasTotales == 0) {
            return 10; // Default: 10 unidades
        }
        
        // Velocidad de venta promedio diaria
        double ventaDiaria = ventasTotales / 30.0;
        
        // Stock mínimo = ventas de 7 días (1 semana de seguridad)
        return (int) Math.ceil(ventaDiaria * 7);
    }
    
    /**
     * Verificar y gestionar alarmas de stock
     */
    private void verificarYGestionarAlarmas(Inventario inventario) {
        // Buscar alarma activa existente
        var alarmaExistente = alarmaStockRepository.findByInventarioAndResuelta(
            inventario,
            false
        );
        
        if (inventario.getCantidad() == 0) {
            // Stock en cero: crear alarma si no existe
            if (alarmaExistente.isEmpty()) {
                AlarmaStock alarma = new AlarmaStock();
                alarma.setInventario(inventario);
                alarma.setTipoAlarma(AlarmaStock.TipoAlarma.STOCK_CERO);
                alarma.setFechaCreacion(LocalDateTime.now());
                alarma.setResuelta(false);
                alarmaStockRepository.save(alarma);
            }
        } else if (inventario.getCantidad() < inventario.getStockMinimoSeguridad()) {
            // Stock bajo: crear o mantener alarma
            if (alarmaExistente.isEmpty()) {
                AlarmaStock alarma = new AlarmaStock();
                alarma.setInventario(inventario);
                alarma.setTipoAlarma(AlarmaStock.TipoAlarma.STOCK_BAJO);
                alarma.setFechaCreacion(LocalDateTime.now());
                alarma.setResuelta(false);
                alarmaStockRepository.save(alarma);
            }
        } else {
            // Stock suficiente: resolver alarma si existe
            alarmaExistente.ifPresent(alarma -> {
                alarma.setResuelta(true);
                alarma.setFechaResolucion(LocalDateTime.now());
                alarmaStockRepository.save(alarma);
            });
        }
    }
    
    /**
     * Convertir Inventario a DTO
     */
    private InventarioDTO convertirAInventarioDTO(Inventario inventario) {
        InventarioDTO dto = new InventarioDTO();
        dto.setInventarioId(inventario.getInventarioId());
        dto.setVarianteId(inventario.getVariante().getVarianteId());
        dto.setSku(inventario.getVariante().getSku());
        dto.setNombreProducto(inventario.getVariante().getProducto().getNombreProducto());
        dto.setUrlImagen(inventario.getVariante().getUrlImagenPrincipal());
        dto.setUbicacionId(inventario.getUbicacion().getUbicacionId());
        dto.setNombreUbicacion(inventario.getUbicacion().getNombreUbicacion());
        dto.setCantidad(inventario.getCantidad());
        dto.setStockMinimoSeguridad(inventario.getStockMinimoSeguridad());
        
        // Verificar si tiene alarma activa
        var alarma = alarmaStockRepository.findByInventarioAndResuelta(
            inventario,
            false
        );
        
        dto.setTieneAlarma(alarma.isPresent());
        dto.setTipoAlarma(alarma.map(a -> a.getTipoAlarma().getDescripcion()).orElse(null));
        
        return dto;
    }
    
    /**
     * Tarea programada: Verificar TODO el inventario y crear alarmas faltantes
     * Se ejecuta:
     * 1. Al iniciar el sistema (initialDelay = 30 segundos)
     * 2. Cada hora después de eso (fixedDelay = 1 hora)
     */
    @Scheduled(initialDelayString = "30000", fixedDelayString = "3600000") // 30seg inicial, luego cada 1h
    @Transactional
    public void verificarYCrearAlarmasFaltantes() {
        List<Inventario> todosLosInventarios = inventarioRepository.findAll();
        int alarmasCreadas = 0;
        
        for (Inventario inventario : todosLosInventarios) {
            // Verificar si ya tiene alarma activa
            var alarmaExistente = alarmaStockRepository.findByInventarioAndResuelta(
                inventario,
                false
            );
            
            // Si no tiene alarma Y tiene stock bajo, crear alarma
            if (alarmaExistente.isEmpty()) {
                if (inventario.getCantidad() == 0) {
                    // Stock cero: crear alarma crítica
                    AlarmaStock alarma = new AlarmaStock();
                    alarma.setInventario(inventario);
                    alarma.setTipoAlarma(AlarmaStock.TipoAlarma.STOCK_CERO);
                    alarma.setFechaCreacion(LocalDateTime.now());
                    alarma.setResuelta(false);
                    alarmaStockRepository.save(alarma);
                    alarmasCreadas++;
                    
                    System.out.println("🔴 Alarma CRÍTICA creada: " + 
                        inventario.getVariante().getSku() + 
                        " (Stock: 0) en " + 
                        inventario.getUbicacion().getNombreUbicacion());
                        
                } else if (inventario.getCantidad() < inventario.getStockMinimoSeguridad()) {
                    // Stock bajo: crear alarma
                    AlarmaStock alarma = new AlarmaStock();
                    alarma.setInventario(inventario);
                    alarma.setTipoAlarma(AlarmaStock.TipoAlarma.STOCK_BAJO);
                    alarma.setFechaCreacion(LocalDateTime.now());
                    alarma.setResuelta(false);
                    alarmaStockRepository.save(alarma);
                    alarmasCreadas++;
                    
                    System.out.println("🟡 Alarma BAJA creada: " + 
                        inventario.getVariante().getSku() + 
                        " (Stock: " + inventario.getCantidad() + 
                        "/" + inventario.getStockMinimoSeguridad() + ") en " + 
                        inventario.getUbicacion().getNombreUbicacion());
                }
            } else {
                // Tiene alarma activa, verificar si el stock mejoró para resolverla automáticamente
                if (inventario.getCantidad() >= inventario.getStockMinimoSeguridad()) {
                    alarmaExistente.ifPresent(alarma -> {
                        alarma.setResuelta(true);
                        alarma.setFechaResolucion(LocalDateTime.now());
                        alarmaStockRepository.save(alarma);
                        
                        System.out.println("✅ Alarma AUTO-RESUELTA: " + 
                            inventario.getVariante().getSku() + 
                            " (Stock restaurado: " + inventario.getCantidad() + 
                            "/" + inventario.getStockMinimoSeguridad() + ")");
                    });
                }
            }
        }
        
        if (alarmasCreadas > 0) {
            System.out.println("📊 Verificación de alarmas completada: " + alarmasCreadas + " alarmas creadas");
        }
    }
}
