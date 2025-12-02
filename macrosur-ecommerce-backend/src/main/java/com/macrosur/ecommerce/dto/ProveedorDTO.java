package com.macrosur.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProveedorDTO {
    private Integer proveedorId;
    private String nombre;
    private String contacto;
    private String telefono;
}
