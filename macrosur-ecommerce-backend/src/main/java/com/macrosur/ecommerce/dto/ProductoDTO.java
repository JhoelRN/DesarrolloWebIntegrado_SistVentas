package com.macrosur.ecommerce.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

/**
 * DTO completo para representar un Producto en respuestas detalladas
 * Incluye todas las propiedades y relaciones
 */
public class ProductoDTO {
    
    private Integer productoId;
    private String codigoProducto;
    private String nombreProducto;
    private String descripcionCorta;
    private String fichaTecnicaHtml;
    private BigDecimal precioUnitario;
    private BigDecimal pesoKg;
    private BigDecimal volumenM3;
    private LocalDateTime fechaCreacion;
    private Boolean activo;
    private String imagenUrl;
    private List<CategoriaDTO> categorias = new ArrayList<>();

    // Constructores
    public ProductoDTO() {
    }

    public ProductoDTO(Integer productoId, String codigoProducto, String nombreProducto, 
                       BigDecimal precioUnitario, Boolean activo) {
        this.productoId = productoId;
        this.codigoProducto = codigoProducto;
        this.nombreProducto = nombreProducto;
        this.precioUnitario = precioUnitario;
        this.activo = activo;
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

    public String getFichaTecnicaHtml() {
        return fichaTecnicaHtml;
    }

    public void setFichaTecnicaHtml(String fichaTecnicaHtml) {
        this.fichaTecnicaHtml = fichaTecnicaHtml;
    }

    public BigDecimal getPrecioUnitario() {
        return precioUnitario;
    }

    public void setPrecioUnitario(BigDecimal precioUnitario) {
        this.precioUnitario = precioUnitario;
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

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(LocalDateTime fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
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

    public List<CategoriaDTO> getCategorias() {
        return categorias;
    }

    public void setCategorias(List<CategoriaDTO> categorias) {
        this.categorias = categorias;
    }
}
