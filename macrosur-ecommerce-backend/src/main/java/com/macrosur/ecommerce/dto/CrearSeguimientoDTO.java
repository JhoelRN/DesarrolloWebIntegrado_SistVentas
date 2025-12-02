package com.macrosur.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearSeguimientoDTO {
    private Long pedidoId;
    private Integer operadorId;
    private String numeroGuia;
    private LocalDateTime fechaEstimadaEntrega;
}
