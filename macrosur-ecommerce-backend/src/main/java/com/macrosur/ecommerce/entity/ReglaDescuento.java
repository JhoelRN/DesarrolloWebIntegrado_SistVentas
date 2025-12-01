package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidad JPA para reglas de descuento y promociones
 * Patrón: Entity (Domain Model Pattern)
 * 
 * Mapea la tabla reglas_descuento que permite gestionar:
 * - Descuentos porcentuales
 * - Montos fijos
 * - Promociones 2x1
 * - Envío gratis
 */
@Entity
@Table(name = "reglas_descuento")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReglaDescuento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "regla_id")
    private Integer reglaId;

    @Column(name = "nombre_regla", nullable = false, length = 100)
    private String nombreRegla;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_descuento", nullable = false)
    private TipoDescuento tipoDescuento;

    @Column(name = "valor_descuento", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorDescuento;

    @Column(name = "acumulable")
    private Boolean acumulable = true;

    @Column(name = "exclusivo")
    private Boolean exclusivo = false;

    @Column(name = "fecha_inicio")
    private LocalDateTime fechaInicio;

    @Column(name = "fecha_fin")
    private LocalDateTime fechaFin;

    @Column(name = "segmentacion_json", columnDefinition = "json")
    private String segmentacionJson;

    /**
     * Enum para tipos de descuento soportados
     */
    public enum TipoDescuento {
        Porcentaje("Porcentaje"),
        Monto_Fijo("Monto Fijo"),
        Dos_X_Uno("2x1"),
        Envio_Gratis("Envio Gratis");

        private final String displayName;

        TipoDescuento(String displayName) {
            this.displayName = displayName;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    /**
     * Valida si la promoción está activa en este momento
     */
    @Transient
    public boolean isActiva() {
        LocalDateTime ahora = LocalDateTime.now();
        
        if (fechaInicio != null && ahora.isBefore(fechaInicio)) {
            return false;
        }
        
        if (fechaFin != null && ahora.isAfter(fechaFin)) {
            return false;
        }
        
        return true;
    }

    /**
     * Calcula el monto de descuento para un precio dado
     */
    @Transient
    public BigDecimal calcularDescuento(BigDecimal precio) {
        if (!isActiva()) {
            return BigDecimal.ZERO;
        }

        return switch (tipoDescuento) {
            case Porcentaje -> precio.multiply(valorDescuento).divide(new BigDecimal("100"));
            case Monto_Fijo -> valorDescuento.min(precio);
            case Dos_X_Uno -> precio.divide(new BigDecimal("2"));
            case Envio_Gratis -> BigDecimal.ZERO; // Se maneja en lógica de envío
        };
    }
}
