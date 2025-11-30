package com.macrosur.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AjusteInventarioDTO {
    private Integer varianteId;
    private Integer ubicacionId;
    private Integer cantidadAjuste;
    private String motivo;
}
