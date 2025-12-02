package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ubicaciones_inventario")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UbicacionInventario {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ubicacion_id")
    private Integer ubicacionId;
    
    @Column(name = "nombre_ubicacion", nullable = false, length = 100)
    private String nombreUbicacion;
    
    @Column(name = "tipo_ubicacion", nullable = false, length = 50)
    private String tipoUbicacion;
    
    @Column(name = "direccion", columnDefinition = "TEXT")
    private String direccion;
    
    @Column(name = "es_fisica", nullable = false)
    private Boolean esFisica = true;
    
    @ManyToOne
    @JoinColumn(name = "proveedor_id")
    private Proveedor proveedor;
}
