package com.macrosur.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearPedidoDTO {
    
    private Long clienteId;
    private String metodoEntrega; // "DOMICILIO" o "RETIRO_EN_TIENDA"
    private Integer direccionEnvioId; // Solo si metodoEntrega = DOMICILIO
    private Integer ubicacionRetiroId; // Solo si metodoEntrega = RETIRO_EN_TIENDA
    private BigDecimal totalEnvio;
    private List<DetallePedidoDTO> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetallePedidoDTO {
        private Integer varianteId;
        private Integer cantidad;
        private BigDecimal precioUnitario;
        private BigDecimal descuentoAplicado;
    }
}
