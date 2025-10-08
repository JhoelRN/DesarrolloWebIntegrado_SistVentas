package com.macrosur.ecommerce.model.dto;

import lombok.Data;
import java.math.BigDecimal;

// DTO usado para recibir datos del frontend y evitar exponer directamente la Entity
@Data
public class ProductoDTO {
    private String sku;
    private String nombre;
    private String descripcionCorta;
    private String descripcionLarga;
    private BigDecimal precio;
    private Integer stock;
    private String imagenUrl;
    private Integer categoriaId; // Solo necesitamos el ID de la categoría
    private Boolean activo;
}