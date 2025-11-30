package com.macrosur.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeguimientoDespachoDTO {
    private Integer seguimientoDespachoId;
    private Long pedidoId;
    private Integer operadorId;
    private String nombreOperador;
    private String urlRastreoBase;
    private String numeroGuia;
    private String urlRastreoCompleta;
    private LocalDateTime fechaDespacho;
    private String estadoEnvio;
    private java.time.LocalDate fechaEstimadaEntrega;
    private LocalDateTime fechaEntrega;
}
