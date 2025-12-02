package com.macrosur.ecommerce.dto;

import jakarta.validation.constraints.*;

/**
 * DTO para crear una nueva reseña
 */
public class CreateResenaDTO {
    
    @NotNull(message = "El ID del producto es obligatorio")
    private Integer productoId;

    @NotNull(message = "La calificación es obligatoria")
    @Min(value = 1, message = "La calificación mínima es 1")
    @Max(value = 5, message = "La calificación máxima es 5")
    private Integer calificacion;

    @Size(max = 1000, message = "El comentario no puede exceder 1000 caracteres")
    private String comentario;

    // Constructores
    public CreateResenaDTO() {
    }

    public CreateResenaDTO(Integer productoId, Integer calificacion, String comentario) {
        this.productoId = productoId;
        this.calificacion = calificacion;
        this.comentario = comentario;
    }

    // Getters y Setters
    public Integer getProductoId() {
        return productoId;
    }

    public void setProductoId(Integer productoId) {
        this.productoId = productoId;
    }

    public Integer getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(Integer calificacion) {
        this.calificacion = calificacion;
    }

    public String getComentario() {
        return comentario;
    }

    public void setComentario(String comentario) {
        this.comentario = comentario;
    }
}
