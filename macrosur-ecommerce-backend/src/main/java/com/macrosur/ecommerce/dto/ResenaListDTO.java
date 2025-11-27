package com.macrosur.ecommerce.dto;

import java.time.LocalDateTime;

/**
 * DTO simplificado para listar reseñas (usado en listados públicos)
 */
public class ResenaListDTO {
    
    private Long resenaId;
    private String clienteNombre;
    private String clienteAvatarUrl;
    private Integer calificacion;
    private String comentario;
    private LocalDateTime fechaResena;
    private boolean compraVerificada;

    // Constructores
    public ResenaListDTO() {
    }

    // Getters y Setters
    public Long getResenaId() {
        return resenaId;
    }

    public void setResenaId(Long resenaId) {
        this.resenaId = resenaId;
    }

    public String getClienteNombre() {
        return clienteNombre;
    }

    public void setClienteNombre(String clienteNombre) {
        this.clienteNombre = clienteNombre;
    }

    public String getClienteAvatarUrl() {
        return clienteAvatarUrl;
    }

    public void setClienteAvatarUrl(String clienteAvatarUrl) {
        this.clienteAvatarUrl = clienteAvatarUrl;
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

    public LocalDateTime getFechaResena() {
        return fechaResena;
    }

    public void setFechaResena(LocalDateTime fechaResena) {
        this.fechaResena = fechaResena;
    }

    public boolean isCompraVerificada() {
        return compraVerificada;
    }

    public void setCompraVerificada(boolean compraVerificada) {
        this.compraVerificada = compraVerificada;
    }
}
