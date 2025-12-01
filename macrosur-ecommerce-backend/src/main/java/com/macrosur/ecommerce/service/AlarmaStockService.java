package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.dto.AlarmaStockDTO;
import com.macrosur.ecommerce.entity.AlarmaStock;
import com.macrosur.ecommerce.entity.Inventario;
import com.macrosur.ecommerce.repository.AlarmaStockRepository;
import com.macrosur.ecommerce.repository.InventarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlarmaStockService {
    
    private final AlarmaStockRepository alarmaStockRepository;
    private final InventarioRepository inventarioRepository;
    
    /**
     * Obtener todas las alarmas activas (no resueltas)
     */
    public List<AlarmaStockDTO> obtenerAlarmasActivas() {
        List<AlarmaStock> alarmas = alarmaStockRepository.findByResueltaOrderByFechaCreacionDesc(false);
        return alarmas.stream()
            .map(this::convertirAAlarmaDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Obtener historial de todas las alarmas
     */
    public List<AlarmaStockDTO> obtenerTodasLasAlarmas() {
        List<AlarmaStock> alarmas = alarmaStockRepository.findAll();
        return alarmas.stream()
            .map(this::convertirAAlarmaDTO)
            .sorted((a, b) -> b.getFechaCreacion().compareTo(a.getFechaCreacion()))
            .collect(Collectors.toList());
    }
    
    /**
     * Resolver manualmente una alarma
     */
    @Transactional
    public AlarmaStockDTO resolverAlarma(Integer alarmaId) {
        AlarmaStock alarma = alarmaStockRepository.findById(alarmaId)
            .orElseThrow(() -> new RuntimeException("Alarma no encontrada"));
        
        alarma.setResuelta(true);
        alarma.setFechaResolucion(LocalDateTime.now());
        alarma = alarmaStockRepository.save(alarma);
        
        return convertirAAlarmaDTO(alarma);
    }
    
    /**
     * Convertir AlarmaStock a DTO
     */
    private AlarmaStockDTO convertirAAlarmaDTO(AlarmaStock alarma) {
        AlarmaStockDTO dto = new AlarmaStockDTO();
        dto.setAlarmaId(alarma.getAlarmaStockId());
        dto.setVarianteId(alarma.getInventario().getVariante().getVarianteId());
        dto.setSku(alarma.getInventario().getVariante().getSku());
        dto.setNombreProducto(alarma.getInventario().getVariante().getProducto().getNombreProducto());
        dto.setUrlImagen(alarma.getInventario().getVariante().getUrlImagenPrincipal());
        dto.setUbicacionId(alarma.getInventario().getUbicacion().getUbicacionId());
        dto.setNombreUbicacion(alarma.getInventario().getUbicacion().getNombreUbicacion());
        dto.setTipoAlarma(alarma.getTipoAlarma().name());
        dto.setFechaCreacion(alarma.getFechaCreacion());
        dto.setFechaResolucion(alarma.getFechaResolucion());
        dto.setResuelta(alarma.getResuelta());
        dto.setCantidadActual(alarma.getInventario().getCantidad());
        dto.setStockMinimo(alarma.getInventario().getStockMinimoSeguridad());
        
        return dto;
    }
}
