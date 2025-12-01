package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ordenes_reposicion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenReposicion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "orden_reposicion_id")
    private Integer ordenReposicionId;
    
    @ManyToOne
    @JoinColumn(name = "proveedor_id", nullable = false)
    private Proveedor proveedor;
    
    @Column(name = "fecha_solicitud")
    private LocalDateTime fechaSolicitud = LocalDateTime.now();
    
    @Column(name = "fecha_autorizacion")
    private LocalDateTime fechaAutorizacion;
    
    @ManyToOne
    @JoinColumn(name = "usuario_admin_id_autoriza")
    private UsuarioAdmin usuarioAutoriza;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "estado_autorizacion")
    private EstadoAutorizacion estadoAutorizacion = EstadoAutorizacion.PENDIENTE;
    
    @Column(name = "costo_total", precision = 10, scale = 2)
    private BigDecimal costoTotal;
    
    @Column(name = "fecha_recepcion")
    private LocalDateTime fechaRecepcion;
    
    @OneToMany(mappedBy = "ordenReposicion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetalleOrdenReposicion> detalles = new ArrayList<>();
    
    public enum EstadoAutorizacion {
        PENDIENTE("Pendiente"),
        AUTORIZADA("Autorizada"),
        RECHAZADA("Rechazada"),
        RECIBIDA("Recibida");
        
        private final String descripcion;
        
        EstadoAutorizacion(String descripcion) {
            this.descripcion = descripcion;
        }
        
        public String getDescripcion() {
            return descripcion;
        }
    }
}
