package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "detalles_orden_reposicion")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleOrdenReposicion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "detalle_orden_reposicion_id")
    private Integer detalleOrdenId;
    
    @ManyToOne
    @JoinColumn(name = "orden_reposicion_id", nullable = false)
    private OrdenReposicion ordenReposicion;
    
    @ManyToOne
    @JoinColumn(name = "variante_producto_id", nullable = false)
    private VarianteProducto variante;
    
    @Column(name = "cantidad_solicitada", nullable = false)
    private Integer cantidadPedida;
    
    @Column(name = "cantidad_recibida")
    private Integer cantidadRecibida;
    
    @Column(name = "precio_unitario", precision = 10, scale = 2)
    private BigDecimal costoUnitario;
}
