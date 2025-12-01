package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.dto.PromocionDTO;
import com.macrosur.ecommerce.entity.ReglaDescuento;
import com.macrosur.ecommerce.repository.ReglaDescuentoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestión de promociones
 * Patrón: Service Layer + Facade
 * 
 * Encapsula la lógica de negocio para promociones y descuentos,
 * proporcionando una interfaz unificada para operaciones CRUD
 * y cálculos de descuentos
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PromocionService {

    private final ReglaDescuentoRepository reglaDescuentoRepository;

    /**
     * Obtener todas las promociones
     */
    @Transactional(readOnly = true)
    public List<PromocionDTO> obtenerTodasPromociones() {
        log.info("Obteniendo todas las promociones");
        
        return reglaDescuentoRepository.findAll().stream()
            .map(PromocionDTO::fromEntity)
            .collect(Collectors.toList());
    }

    /**
     * Obtener promociones activas
     */
    @Transactional(readOnly = true)
    public List<PromocionDTO> obtenerPromocionesActivas() {
        log.info("Obteniendo promociones activas");
        
        LocalDateTime ahora = LocalDateTime.now();
        return reglaDescuentoRepository.findPromocionesActivas(ahora).stream()
            .map(PromocionDTO::fromEntity)
            .collect(Collectors.toList());
    }

    /**
     * Obtener promoción por ID
     */
    @Transactional(readOnly = true)
    public PromocionDTO obtenerPromocionPorId(Integer id) {
        log.info("Obteniendo promoción con ID: {}", id);
        
        ReglaDescuento regla = reglaDescuentoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Promoción no encontrada con ID: " + id));
        
        return PromocionDTO.fromEntity(regla);
    }

    /**
     * Crear nueva promoción
     */
    public PromocionDTO crearPromocion(PromocionDTO dto) {
        log.info("Creando nueva promoción: {}", dto.getNombreRegla());
        
        // Validaciones de negocio
        validarPromocion(dto);
        
        // Convertir DTO a entidad y guardar
        ReglaDescuento regla = dto.toEntity();
        regla.setReglaId(null); // Asegurar que es nueva
        
        ReglaDescuento guardada = reglaDescuentoRepository.save(regla);
        
        log.info("Promoción creada con ID: {}", guardada.getReglaId());
        return PromocionDTO.fromEntity(guardada);
    }

    /**
     * Actualizar promoción existente
     */
    public PromocionDTO actualizarPromocion(Integer id, PromocionDTO dto) {
        log.info("Actualizando promoción con ID: {}", id);
        
        // Verificar que existe
        ReglaDescuento existente = reglaDescuentoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Promoción no encontrada con ID: " + id));
        
        // Validaciones de negocio
        validarPromocion(dto);
        
        // Actualizar campos
        existente.setNombreRegla(dto.getNombreRegla());
        existente.setTipoDescuento(dto.toEntity().getTipoDescuento());
        existente.setValorDescuento(dto.getValorDescuento());
        existente.setAcumulable(dto.getAcumulable());
        existente.setExclusivo(dto.getExclusivo());
        existente.setFechaInicio(dto.getFechaInicio());
        existente.setFechaFin(dto.getFechaFin());
        existente.setSegmentacionJson(dto.getSegmentacionJson());
        
        ReglaDescuento actualizada = reglaDescuentoRepository.save(existente);
        
        log.info("Promoción actualizada: {}", actualizada.getReglaId());
        return PromocionDTO.fromEntity(actualizada);
    }

    /**
     * Eliminar promoción
     */
    public void eliminarPromocion(Integer id) {
        log.info("Eliminando promoción con ID: {}", id);
        
        if (!reglaDescuentoRepository.existsById(id)) {
            throw new RuntimeException("Promoción no encontrada con ID: " + id);
        }
        
        reglaDescuentoRepository.deleteById(id);
        log.info("Promoción eliminada: {}", id);
    }

    /**
     * Buscar promociones por nombre
     */
    @Transactional(readOnly = true)
    public List<PromocionDTO> buscarPorNombre(String nombre) {
        log.info("Buscando promociones con nombre: {}", nombre);
        
        return reglaDescuentoRepository.findByNombreReglaContainingIgnoreCase(nombre).stream()
            .map(PromocionDTO::fromEntity)
            .collect(Collectors.toList());
    }

    /**
     * Obtener promociones por tipo
     */
    @Transactional(readOnly = true)
    public List<PromocionDTO> obtenerPorTipo(String tipo) {
        log.info("Obteniendo promociones de tipo: {}", tipo);
        
        ReglaDescuento.TipoDescuento tipoEnum = switch (tipo) {
            case "Porcentaje" -> ReglaDescuento.TipoDescuento.Porcentaje;
            case "Monto Fijo" -> ReglaDescuento.TipoDescuento.Monto_Fijo;
            case "2x1" -> ReglaDescuento.TipoDescuento.Dos_X_Uno;
            case "Envio Gratis" -> ReglaDescuento.TipoDescuento.Envio_Gratis;
            default -> throw new IllegalArgumentException("Tipo inválido: " + tipo);
        };
        
        return reglaDescuentoRepository.findByTipoDescuento(tipoEnum).stream()
            .map(PromocionDTO::fromEntity)
            .collect(Collectors.toList());
    }

    /**
     * Obtener estadísticas de promociones
     */
    @Transactional(readOnly = true)
    public EstadisticasPromociones obtenerEstadisticas() {
        log.info("Obteniendo estadísticas de promociones");
        
        LocalDateTime ahora = LocalDateTime.now();
        long totalPromociones = reglaDescuentoRepository.count();
        long promocionesActivas = reglaDescuentoRepository.contarPromocionesActivas(ahora);
        
        LocalDateTime dentroUnaSemana = ahora.plusDays(7);
        List<ReglaDescuento> proximasExpirar = reglaDescuentoRepository
            .findPromocionesProximasExpirar(ahora, dentroUnaSemana);
        
        return new EstadisticasPromociones(
            totalPromociones,
            promocionesActivas,
            totalPromociones - promocionesActivas,
            proximasExpirar.size()
        );
    }

    /**
     * Calcular descuento aplicable a un precio
     */
    @Transactional(readOnly = true)
    public BigDecimal calcularDescuentoAplicable(Integer promocionId, BigDecimal precio) {
        log.info("Calculando descuento para promoción {} en precio {}", promocionId, precio);
        
        ReglaDescuento regla = reglaDescuentoRepository.findById(promocionId)
            .orElseThrow(() -> new RuntimeException("Promoción no encontrada"));
        
        return regla.calcularDescuento(precio);
    }

    /**
     * Validaciones de negocio para promociones
     */
    private void validarPromocion(PromocionDTO dto) {
        // Validar que fechaFin sea posterior a fechaInicio
        if (dto.getFechaInicio() != null && dto.getFechaFin() != null) {
            if (dto.getFechaFin().isBefore(dto.getFechaInicio())) {
                throw new IllegalArgumentException(
                    "La fecha de fin debe ser posterior a la fecha de inicio"
                );
            }
        }
        
        // Validar valor de descuento según tipo
        if ("Porcentaje".equals(dto.getTipoDescuento())) {
            if (dto.getValorDescuento().compareTo(new BigDecimal("100")) > 0) {
                throw new IllegalArgumentException(
                    "El porcentaje de descuento no puede ser mayor a 100"
                );
            }
        }
        
        // No puede ser acumulable y exclusivo al mismo tiempo
        if (Boolean.TRUE.equals(dto.getAcumulable()) && Boolean.TRUE.equals(dto.getExclusivo())) {
            throw new IllegalArgumentException(
                "Una promoción no puede ser acumulable y exclusiva al mismo tiempo"
            );
        }
    }

    /**
     * DTO para estadísticas
     */
    public record EstadisticasPromociones(
        long totalPromociones,
        long promocionesActivas,
        long promocionesInactivas,
        long proximasExpirar
    ) {}
}
