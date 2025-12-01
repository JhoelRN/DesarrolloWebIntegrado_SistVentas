package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "seguimientos_despacho")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeguimientoDespacho {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seguimiento_despacho_id")
    private Integer seguimientoDespachoId;
    
    @Column(name = "pedido_id", nullable = false)
    private Long pedidoId;
    
    @ManyToOne
    @JoinColumn(name = "operador_id", nullable = false)
    private OperadorLogistico operador;
    
    @Column(name = "numero_guia", nullable = false)
    private String numeroGuia;
    
    @Column(name = "fecha_despacho")
    private LocalDateTime fechaDespacho = LocalDateTime.now();
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_envio")
    private EstadoEnvio estadoEnvio = EstadoEnvio.EN_CAMINO;
    
    @Column(name = "fecha_estimada_entrega")
    private java.time.LocalDate fechaEstimadaEntrega;
    
    @Column(name = "fecha_entrega")
    private LocalDateTime fechaEntrega;
    
    public enum EstadoEnvio {
        EN_CAMINO("En Camino"),
        EN_DISTRIBUCION("En Distribución"),
        ENTREGADO("Entregado"),
        FALLIDO("Fallido");
        
        private final String descripcion;
        
        EstadoEnvio(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
}
