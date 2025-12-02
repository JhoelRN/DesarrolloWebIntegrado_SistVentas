package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entidad Reseña - Calificaciones y comentarios de clientes sobre productos
 * Estados: Pendiente, Aprobada, Rechazada (moderación)
 */
@Entity
@Table(name = "resenas")
public class Resena {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resena_id")
    private Long resenaId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "producto_id", nullable = false)
    private Producto producto;

    @Column(name = "calificacion", nullable = false)
    private Integer calificacion; // 1-5 estrellas

    @Column(name = "comentario", columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "fecha_resena", nullable = false, updatable = false)
    private LocalDateTime fechaResena;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_resena", length = 20)
    private EstadoResena estadoResena;

    @Column(name = "fecha_compra_verificada")
    private LocalDateTime fechaCompraVerificada;

    // Enum para estados
    public enum EstadoResena {
        Pendiente,
        Aprobada,
        Rechazada
    }

    // Constructores
    public Resena() {
        this.fechaResena = LocalDateTime.now();
        this.estadoResena = EstadoResena.Pendiente;
    }

    public Resena(Cliente cliente, Producto producto, Integer calificacion, String comentario) {
        this();
        this.cliente = cliente;
        this.producto = producto;
        this.calificacion = calificacion;
        this.comentario = comentario;
    }

    // Getters y Setters
    public Long getResenaId() {
        return resenaId;
    }

    public void setResenaId(Long resenaId) {
        this.resenaId = resenaId;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Integer getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(Integer calificacion) {
        if (calificacion < 1 || calificacion > 5) {
            throw new IllegalArgumentException("Calificación debe estar entre 1 y 5");
        }
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

    public EstadoResena getEstadoResena() {
        return estadoResena;
    }

    public void setEstadoResena(EstadoResena estadoResena) {
        this.estadoResena = estadoResena;
    }

    public LocalDateTime getFechaCompraVerificada() {
        return fechaCompraVerificada;
    }

    public void setFechaCompraVerificada(LocalDateTime fechaCompraVerificada) {
        this.fechaCompraVerificada = fechaCompraVerificada;
    }

    // Helper methods
    public boolean isAprobada() {
        return this.estadoResena == EstadoResena.Aprobada;
    }

    public boolean isPendiente() {
        return this.estadoResena == EstadoResena.Pendiente;
    }

    public void aprobar() {
        this.estadoResena = EstadoResena.Aprobada;
    }

    public void rechazar() {
        this.estadoResena = EstadoResena.Rechazada;
    }
}
