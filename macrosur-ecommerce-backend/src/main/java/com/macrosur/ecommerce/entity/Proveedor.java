package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "proveedores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Proveedor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "proveedor_id")
    private Integer proveedorId;
    
    @Column(nullable = false, length = 150)
    private String nombre;
    
    @Column(length = 150)
    private String contacto;
    
    @Column(length = 20)
    private String telefono;
}
