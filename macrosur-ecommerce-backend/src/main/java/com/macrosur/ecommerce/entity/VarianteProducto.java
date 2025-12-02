package com.macrosur.ecommerce.entity;

import com.macrosur.ecommerce.listener.VarianteProductoListener;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "variantes_producto")
@EntityListeners(VarianteProductoListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VarianteProducto {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variante_id")
    private Integer varianteId;
    
    @ManyToOne
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;
    
    @Column(nullable = false, unique = true, length = 50)
    private String sku;
    
    @Column(name = "precio_base", nullable = false, precision = 10, scale = 2)
    private BigDecimal precioBase;
    
    @Column(name = "url_imagen_principal", length = 255)
    private String urlImagenPrincipal;
}
