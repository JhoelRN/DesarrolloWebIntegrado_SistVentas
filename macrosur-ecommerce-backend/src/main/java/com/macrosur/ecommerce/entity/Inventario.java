package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "inventario", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"variante_id", "ubicacion_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inventario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inventario_id")
    private Integer inventarioId;
    
    @ManyToOne
    @JoinColumn(name = "variante_id", nullable = false)
    private VarianteProducto variante;
    
    @ManyToOne
    @JoinColumn(name = "ubicacion_id", nullable = false)
    private UbicacionInventario ubicacion;
    
    @Column(nullable = false)
    private Integer cantidad = 0;
    
    @Column(name = "stock_minimo_seguridad")
    private Integer stockMinimoSeguridad = 0;
}
