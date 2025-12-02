package com.macrosur.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CrearOrdenReposicionDTO {
    private Integer proveedorId;
    private List<DetalleOrdenItemDTO> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DetalleOrdenItemDTO {
        private Integer varianteId;
        private Integer cantidadPedida;
    }
}
