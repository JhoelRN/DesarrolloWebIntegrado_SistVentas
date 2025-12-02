package com.macrosur.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdenReposicionDTO {
    private Integer ordenReposicionId;
    private Integer proveedorId;
    private String nombreProveedor;
    private String contactoProveedor;
    private LocalDateTime fechaSolicitud;
    private LocalDateTime fechaAutorizacion;
    private Integer usuarioAutorizaId;
    private String nombreUsuarioAutoriza;
    private String estadoAutorizacion;
    private BigDecimal costoTotal;
    private LocalDateTime fechaRecepcion;
    private List<DetalleOrdenReposicionDTO> detalles;
}
