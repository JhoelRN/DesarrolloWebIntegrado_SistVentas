package com.macrosur.ecommerce.dto;

import com.macrosur.ecommerce.entity.ReglaDescuento;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para transferencia de datos de promociones
 * Patrón: DTO (Data Transfer Object)
 * 
 * Separa la capa de presentación de la capa de persistencia
 * y aplica validaciones de entrada
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PromocionDTO {

    private Integer reglaId;

    @NotBlank(message = "El nombre de la promoción es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombreRegla;

    @NotNull(message = "El tipo de descuento es obligatorio")
    private String tipoDescuento; // "Porcentaje", "Monto Fijo", "2x1", "Envio Gratis"

    @NotNull(message = "El valor del descuento es obligatorio")
    @DecimalMin(value = "0.00", message = "El valor no puede ser negativo")
    @DecimalMax(value = "999999.99", message = "El valor es demasiado alto")
    private BigDecimal valorDescuento;

    private Boolean acumulable = true;

    private Boolean exclusivo = false;

    private LocalDateTime fechaInicio;

    private LocalDateTime fechaFin;

    private String segmentacionJson;

    // Campos calculados para el frontend
    private Boolean activa;
    private String estadoTexto;
    private Long diasRestantes;

    /**
     * Convierte la entidad a DTO
     */
    public static PromocionDTO fromEntity(ReglaDescuento entity) {
        if (entity == null) return null;

        PromocionDTO dto = PromocionDTO.builder()
            .reglaId(entity.getReglaId())
            .nombreRegla(entity.getNombreRegla())
            .tipoDescuento(entity.getTipoDescuento().getDisplayName())
            .valorDescuento(entity.getValorDescuento())
            .acumulable(entity.getAcumulable())
            .exclusivo(entity.getExclusivo())
            .fechaInicio(entity.getFechaInicio())
            .fechaFin(entity.getFechaFin())
            .segmentacionJson(entity.getSegmentacionJson())
            .activa(entity.isActiva())
            .build();

        // Calcular estado y días restantes
        dto.setEstadoTexto(calcularEstadoTexto(entity));
        dto.setDiasRestantes(calcularDiasRestantes(entity));

        return dto;
    }

    /**
     * Convierte el DTO a entidad
     */
    public ReglaDescuento toEntity() {
        ReglaDescuento entity = new ReglaDescuento();
        entity.setReglaId(this.reglaId);
        entity.setNombreRegla(this.nombreRegla);
        
        // Convertir string a enum
        entity.setTipoDescuento(parseTipoDescuento(this.tipoDescuento));
        
        entity.setValorDescuento(this.valorDescuento);
        entity.setAcumulable(this.acumulable != null ? this.acumulable : true);
        entity.setExclusivo(this.exclusivo != null ? this.exclusivo : false);
        entity.setFechaInicio(this.fechaInicio);
        entity.setFechaFin(this.fechaFin);
        
        // Convertir cadena vacía a NULL para columna JSON
        entity.setSegmentacionJson(
            this.segmentacionJson != null && !this.segmentacionJson.trim().isEmpty() 
                ? this.segmentacionJson 
                : null
        );

        return entity;
    }

    /**
     * Parsea el tipo de descuento desde string
     * Soporta tanto valores con guiones bajos (del frontend) como con espacios (legacy)
     */
    private static ReglaDescuento.TipoDescuento parseTipoDescuento(String tipo) {
        return switch (tipo) {
            case "Porcentaje" -> ReglaDescuento.TipoDescuento.Porcentaje;
            case "Monto Fijo", "Monto_Fijo" -> ReglaDescuento.TipoDescuento.Monto_Fijo;
            case "2x1", "Dos_X_Uno" -> ReglaDescuento.TipoDescuento.Dos_X_Uno;
            case "Envio Gratis", "Envio_Gratis" -> ReglaDescuento.TipoDescuento.Envio_Gratis;
            default -> throw new IllegalArgumentException("Tipo de descuento inválido: " + tipo);
        };
    }

    /**
     * Calcula el texto del estado de la promoción
     */
    private static String calcularEstadoTexto(ReglaDescuento entity) {
        LocalDateTime ahora = LocalDateTime.now();
        
        if (entity.getFechaInicio() != null && ahora.isBefore(entity.getFechaInicio())) {
            return "Programada";
        }
        
        if (entity.getFechaFin() != null && ahora.isAfter(entity.getFechaFin())) {
            return "Expirada";
        }
        
        return "Activa";
    }

    /**
     * Calcula días restantes hasta expiración
     */
    private static Long calcularDiasRestantes(ReglaDescuento entity) {
        if (entity.getFechaFin() == null) {
            return null; // Sin fecha de expiración
        }
        
        LocalDateTime ahora = LocalDateTime.now();
        if (ahora.isAfter(entity.getFechaFin())) {
            return 0L; // Ya expiró
        }
        
        return java.time.Duration.between(ahora, entity.getFechaFin()).toDays();
    }
}
