package com.macrosur.ecommerce.dto;

import java.time.LocalDateTime;

/**
 * DTO completo para Reseña - usado en respuestas detalladas
 */
public class ResenaDTO {
    
    private Long resenaId;
    private ClienteDTO cliente;
    private Integer productoId;
    private String productoNombre;
    private Integer calificacion;
    private String comentario;
    private LocalDateTime fechaResena;
    private String estadoResena; // Pendiente, Aprobada, Rechazada
    private LocalDateTime fechaCompraVerificada;

    // Constructores
    public ResenaDTO() {
    }

    // Getters y Setters
    public Long getResenaId() {
        return resenaId;
    }

    public void setResenaId(Long resenaId) {
        this.resenaId = resenaId;
    }

    public ClienteDTO getCliente() {
        return cliente;
    }

    public void setCliente(ClienteDTO cliente) {
        this.cliente = cliente;
    }

    public Integer getProductoId() {
        return productoId;
    }

    public void setProductoId(Integer productoId) {
        this.productoId = productoId;
    }

    public String getProductoNombre() {
        return productoNombre;
    }

    public void setProductoNombre(String productoNombre) {
        this.productoNombre = productoNombre;
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

    public String getEstadoResena() {
        return estadoResena;
    }

    public void setEstadoResena(String estadoResena) {
        this.estadoResena = estadoResena;
    }

    public LocalDateTime getFechaCompraVerificada() {
        return fechaCompraVerificada;
    }

    public void setFechaCompraVerificada(LocalDateTime fechaCompraVerificada) {
        this.fechaCompraVerificada = fechaCompraVerificada;
    }
}
