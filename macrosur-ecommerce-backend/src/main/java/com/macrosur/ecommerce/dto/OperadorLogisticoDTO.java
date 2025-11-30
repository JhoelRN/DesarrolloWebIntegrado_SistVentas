package com.macrosur.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OperadorLogisticoDTO {
    private Integer operadorId;
    private String nombre;
    private String urlRastreoBase;
}
