package com.macrosur.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventarioDTO {
    private Integer inventarioId;
    private Integer varianteId;
    private String sku;
    private String nombreProducto;
    private String urlImagen;
    private Integer ubicacionId;
    private String nombreUbicacion;
    private Integer cantidad;
    private Integer stockMinimoSeguridad;
    private Boolean tieneAlarma;
    private String tipoAlarma;
}
