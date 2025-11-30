package com.macrosur.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecepcionOrdenDTO {
    private Integer ordenReposicionId;
    private List<RecepcionItemDTO> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecepcionItemDTO {
        private Integer detalleOrdenId;
        private Integer cantidadRecibida;
    }
}
