package com.macrosur.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DetalleOrdenReposicionDTO {
    private Integer detalleOrdenId;
    private Integer varianteId;
    private String sku;
    private String nombreProducto;
    private String urlImagen;
    private Integer cantidadPedida;
    private Integer cantidadRecibida;
    private BigDecimal costoUnitario;
    private BigDecimal subtotal;
}
