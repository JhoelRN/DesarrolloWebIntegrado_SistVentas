package com.macrosur.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransferenciaStockDTO {
    private Integer varianteId;
    private Integer ubicacionOrigenId;
    private Integer ubicacionDestinoId;
    private Integer cantidad;
    private Long pedidoId; // Opcional, si la transferencia es por un pedido
}
