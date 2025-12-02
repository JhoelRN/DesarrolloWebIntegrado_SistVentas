package com.macrosur.ecommerce.dto;

import java.util.List;
import java.util.ArrayList;

/**
 * DTO para representar una Categoría en respuestas
 * Incluye información jerárquica de subcategorías
 */
public class CategoriaDTO {
    
    private Integer categoriaId;
    private String nombre;
    private String descripcion;
    private Integer categoriaPadreId;
    private String categoriaPadreNombre;
    private Boolean visibleCliente;
    private Boolean activo;
    private Integer nivel;
    private List<CategoriaDTO> subcategorias = new ArrayList<>();
    private Integer cantidadProductos;

    // Constructores
    public CategoriaDTO() {
    }

    public CategoriaDTO(Integer categoriaId, String nombre, String descripcion, 
                        Integer categoriaPadreId, Boolean visibleCliente, Boolean activo) {
        this.categoriaId = categoriaId;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoriaPadreId = categoriaPadreId;
        this.visibleCliente = visibleCliente;
        this.activo = activo;
    }

    // Getters y Setters
    public Integer getCategoriaId() {
        return categoriaId;
    }

    public void setCategoriaId(Integer categoriaId) {
        this.categoriaId = categoriaId;
    }

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

    public String getCategoriaPadreNombre() {
        return categoriaPadreNombre;
    }

    public void setCategoriaPadreNombre(String categoriaPadreNombre) {
        this.categoriaPadreNombre = categoriaPadreNombre;
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

    public Integer getNivel() {
        return nivel;
    }

    public void setNivel(Integer nivel) {
        this.nivel = nivel;
    }

    public List<CategoriaDTO> getSubcategorias() {
        return subcategorias;
    }

    public void setSubcategorias(List<CategoriaDTO> subcategorias) {
        this.subcategorias = subcategorias;
    }

    public Integer getCantidadProductos() {
        return cantidadProductos;
    }

    public void setCantidadProductos(Integer cantidadProductos) {
        this.cantidadProductos = cantidadProductos;
    }
}
