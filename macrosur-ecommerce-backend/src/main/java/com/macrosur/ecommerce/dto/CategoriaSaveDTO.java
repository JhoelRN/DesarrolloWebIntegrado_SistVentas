package com.macrosur.ecommerce.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO para crear o actualizar una Categoría
 * Incluye validaciones de entrada
 */
public class CategoriaSaveDTO {
    
    @NotBlank(message = "El nombre de la categoría es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;

    @Size(max = 1000, message = "La descripción no puede exceder 1000 caracteres")
    private String descripcion;

    private Integer categoriaPadreId;

    private Boolean visibleCliente = true;

    private Boolean activo = true;

    // Constructores
    public CategoriaSaveDTO() {
    }

    public CategoriaSaveDTO(String nombre, String descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    // Getters y Setters
    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Integer getCategoriaPadreId() {
        return categoriaPadreId;
    }

    public void setCategoriaPadreId(Integer categoriaPadreId) {
        this.categoriaPadreId = categoriaPadreId;
    }

    public Boolean getVisibleCliente() {
        return visibleCliente;
    }

    public void setVisibleCliente(Boolean visibleCliente) {
        this.visibleCliente = visibleCliente;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}
