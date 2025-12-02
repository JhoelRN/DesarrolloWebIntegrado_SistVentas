package com.macrosur.ecommerce.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.Set;
import java.util.HashSet;

/**
 * DTO para crear o actualizar un Producto
 * Incluye validaciones de entrada
 */
public class ProductoSaveDTO {
    
    @Size(max = 50, message = "El código del producto no puede exceder 50 caracteres")
    private String codigoProducto;

    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(min = 3, max = 255, message = "El nombre debe tener entre 3 y 255 caracteres")
    private String nombreProducto;

    @Size(max = 500, message = "La descripción corta no puede exceder 500 caracteres")
    private String descripcionCorta;

    private String fichaTecnicaHtml;

    @NotNull(message = "El precio unitario es obligatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "El precio no puede ser negativo")
    @Digits(integer = 10, fraction = 2, message = "El precio debe tener máximo 10 dígitos enteros y 2 decimales")
    private BigDecimal precioUnitario;

    @NotNull(message = "El peso es obligatorio")
    @DecimalMin(value = "0.01", message = "El peso debe ser mayor a 0")
    @Digits(integer = 6, fraction = 2, message = "El peso debe tener máximo 6 dígitos enteros y 2 decimales")
    private BigDecimal pesoKg;

    @DecimalMin(value = "0.0", inclusive = true, message = "El volumen no puede ser negativo")
    @Digits(integer = 4, fraction = 4, message = "El volumen debe tener máximo 4 dígitos enteros y 4 decimales")
    private BigDecimal volumenM3;

    private Boolean activo = true;

    @Size(max = 500, message = "La URL de la imagen no puede exceder 500 caracteres")
    private String imagenUrl;

    @NotNull(message = "El producto debe tener al menos una categoría")
    @Size(min = 1, message = "El producto debe tener al menos una categoría")
    private Set<Integer> categoriasIds = new HashSet<>();

    // Constructores
    public ProductoSaveDTO() {
    }

    public ProductoSaveDTO(String nombreProducto, BigDecimal precioUnitario, BigDecimal pesoKg) {
        this.nombreProducto = nombreProducto;
        this.precioUnitario = precioUnitario;
        this.pesoKg = pesoKg;
    }

    // Getters y Setters
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

    public Set<Integer> getCategoriasIds() {
        return categoriasIds;
    }

    public void setCategoriasIds(Set<Integer> categoriasIds) {
        this.categoriasIds = categoriasIds;
    }
}
