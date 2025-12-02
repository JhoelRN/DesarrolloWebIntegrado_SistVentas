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
public class PedidoResponseDTO {
    
    private Long pedidoId;
    private Long clienteId;
    private LocalDateTime fechaPedido;
    private String estado;
    private BigDecimal totalNeto;
    private BigDecimal totalImpuestos;
    private BigDecimal totalEnvio;
    private BigDecimal totalDescuento;
    private BigDecimal totalFinal;
    private String metodoEntrega;
    private Integer direccionEnvioId;
    private Integer ubicacionRetiroId;
    private List<DetallePedidoResponseDTO> detalles;
    
    // Información de seguimiento (si existe)
    private SeguimientoInfoDTO seguimiento;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetallePedidoResponseDTO {
        private Long detallePedidoId;
        private Integer varianteId;
        private String nombreProducto;
        private String nombreVariante;
        private String sku;
        private BigDecimal precioUnitario;
        private Integer cantidad;
        private BigDecimal descuentoAplicado;
        private BigDecimal subtotal;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeguimientoInfoDTO {
        private Integer seguimientoId;
        private String numeroGuia;
        private String estadoEnvio;
        private String nombreOperador;
        private String urlRastreoCompleta;
        private LocalDateTime fechaDespacho;
        private LocalDateTime fechaEntrega;
    }
}
