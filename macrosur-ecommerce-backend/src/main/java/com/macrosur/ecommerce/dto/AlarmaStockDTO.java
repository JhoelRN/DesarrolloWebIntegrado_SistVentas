package com.macrosur.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AlarmaStockDTO {
    private Integer alarmaId;
    private Integer varianteId;
    private String sku;
    private String nombreProducto;
    private String urlImagen;
    private Integer ubicacionId;
    private String nombreUbicacion;
    private String tipoAlarma;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaResolucion;
    private Boolean resuelta;
    private Integer cantidadActual;
    private Integer stockMinimo;
}
