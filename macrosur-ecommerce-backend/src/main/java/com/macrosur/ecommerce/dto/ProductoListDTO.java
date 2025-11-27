package com.macrosur.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * DTO simplificado para listar productos (usado en listados con paginación)
 * Contiene solo la información esencial para mostrar en tablas/tarjetas
 */
public class ProductoListDTO {
    
    private Integer productoId;
    private String codigoProducto;
    private String nombreProducto;
    private String descripcionCorta;
    private BigDecimal precioUnitario;
    private Boolean activo;
    private String imagenUrl;
    private LocalDateTime fechaCreacion;
    private String categoriasNombres; // String concatenado de nombres de categorías
    private Integer cantidadCategorias;
    private BigDecimal pesoKg;
    private BigDecimal volumenM3;
    private String fichaTecnicaHtml;
    private List<CategoriaDTO> categorias = new ArrayList<>();

    // Constructores
    public ProductoListDTO() {
    }

    public ProductoListDTO(Integer productoId, String codigoProducto, String nombreProducto, 
                           BigDecimal precioUnitario, Boolean activo, String imagenUrl) {
        this.productoId = productoId;
        this.codigoProducto = codigoProducto;
        this.nombreProducto = nombreProducto;
        this.precioUnitario = precioUnitario;
        this.activo = activo;
        this.imagenUrl = imagenUrl;
    }

    // Getters y Setters
    public Integer getProductoId() {
        return productoId;
    }

    public void setProductoId(Integer productoId) {
        this.productoId = productoId;
    }

    public String getCodigoProducto() {
        return codigoProducto;
    }

    public void setCodigoProducto(String codigoProducto) {
        this.codigoProducto = codigoProducto;
    }

    public String getNombreProducto() {
        return nombreProducto;
    }

    public void setNombreProducto(String nombreProducto) {
        this.nombreProducto = nombreProducto;
    }

    public String getDescripcionCorta() {
        return descripcionCorta;
    }

    public void setDescripcionCorta(String descripcionCorta) {
        this.descripcionCorta = descripcionCorta;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public String getCategoriasNombres() {
        return categoriasNombres;
    }

    public void setCategoriasNombres(String categoriasNombres) {
        this.categoriasNombres = categoriasNombres;
    }

    public Integer getCantidadCategorias() {
        return cantidadCategorias;
    }

    public void setCantidadCategorias(Integer cantidadCategorias) {
        this.cantidadCategorias = cantidadCategorias;
    }

    public BigDecimal getPesoKg() {
        return pesoKg;
    }

    public void setPesoKg(BigDecimal pesoKg) {
        this.pesoKg = pesoKg;
    }

    public BigDecimal getVolumenM3() {
        return volumenM3;
    }

    public void setVolumenM3(BigDecimal volumenM3) {
        this.volumenM3 = volumenM3;
    }

    public String getFichaTecnicaHtml() {
        return fichaTecnicaHtml;
    }

    public void setFichaTecnicaHtml(String fichaTecnicaHtml) {
        this.fichaTecnicaHtml = fichaTecnicaHtml;
    }

    public List<CategoriaDTO> getCategorias() {
        return categorias;
    }

    public void setCategorias(List<CategoriaDTO> categorias) {
        this.categorias = categorias;
    }

    /**
     * Helper para construir el string de categorías desde una lista de DTOs
     */
    public void setCategoriasFromList(List<CategoriaDTO> categorias) {
        if (categorias != null && !categorias.isEmpty()) {
            this.categoriasNombres = categorias.stream()
                    .map(CategoriaDTO::getNombre)
                    .collect(Collectors.joining(", "));
            this.cantidadCategorias = categorias.size();
        } else {
            this.categoriasNombres = "";
            this.cantidadCategorias = 0;
        }
    }
}
