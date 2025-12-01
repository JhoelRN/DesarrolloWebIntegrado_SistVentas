package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "alarmas_stock")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlarmaStock {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "alarma_stock_id")
    private Integer alarmaStockId;
    
    @ManyToOne
    @JoinColumn(name = "inventario_id", nullable = false)
    private Inventario inventario;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_alarma", nullable = false)
    private TipoAlarma tipoAlarma;
    
    @Column(name = "fecha_creacion")
    private LocalDateTime fechaCreacion = LocalDateTime.now();
    
    @Column(name = "resuelta", nullable = false)
    private Boolean resuelta = false;
    
    @Column(name = "fecha_resolucion")
    private LocalDateTime fechaResolucion;
    
    public enum TipoAlarma {
        STOCK_BAJO("Bajo Stock"),
        BAJO_STOCK("Bajo Stock"),  // Alias para compatibilidad
        STOCK_CERO("Stock Cero"),
        VENTA_CONSIGNADA("Venta Consignada");
        
        private final String descripcion;
        
        TipoAlarma(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
}
