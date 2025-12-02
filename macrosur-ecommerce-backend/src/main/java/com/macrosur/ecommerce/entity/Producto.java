package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad Producto - Representa un producto del catálogo
 * Mapea a la tabla 'productos' en la base de datos
 * Implementa soft delete con el campo 'activo'
 */
@Entity
@Table(name = "productos")
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "producto_id")
    private Integer productoId;

    @Column(name = "codigo_producto", length = 50, unique = true)
    private String codigoProducto;

    @Column(name = "nombre_producto", nullable = false, length = 255)
    private String nombreProducto;

    @Column(name = "descripcion_corta", length = 500)
    private String descripcionCorta;

    @Column(name = "ficha_tecnica_html", columnDefinition = "TEXT")
    private String fichaTecnicaHtml;

    @Column(name = "precio_unitario", precision = 10, scale = 2)
    private BigDecimal precioUnitario = BigDecimal.ZERO;

    @Column(name = "peso_kg", nullable = false, precision = 8, scale = 2)
    private BigDecimal pesoKg;

    @Column(name = "volumen_m3", precision = 8, scale = 4)
    private BigDecimal volumenM3;

    @Column(name = "fecha_creacion", nullable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    // URL de la imagen principal del producto (almacenado como texto)
    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    // Relación Many-to-Many con Categoria
    @ManyToMany(fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "producto_categoria",
        joinColumns = @JoinColumn(name = "producto_id"),
        inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    private Set<Categoria> categorias = new HashSet<>();

    // Constructores
    public Producto() {
    }

    public Producto(String nombreProducto, BigDecimal precioUnitario, BigDecimal pesoKg) {
        this.nombreProducto = nombreProducto;
        this.precioUnitario = precioUnitario;
        this.pesoKg = pesoKg;
    }

    // Lifecycle callbacks
    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
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

    public Set<Categoria> getCategorias() {
        return categorias;
    }

    public void setCategorias(Set<Categoria> categorias) {
        this.categorias = categorias;
    }

    // Métodos de utilidad para manejar la relación Many-to-Many
    public void addCategoria(Categoria categoria) {
        this.categorias.add(categoria);
        categoria.getProductos().add(this);
    }

    public void removeCategoria(Categoria categoria) {
        this.categorias.remove(categoria);
        categoria.getProductos().remove(this);
    }

    public void clearCategorias() {
        for (Categoria categoria : new HashSet<>(this.categorias)) {
            removeCategoria(categoria);
        }
    }

    /**
     * Verifica si el producto tiene al menos una categoría asignada
     */
    public boolean tieneCategorias() {
        return categorias != null && !categorias.isEmpty();
    }

    /**
     * Soft delete - marca el producto como inactivo
     */
    public void softDelete() {
        this.activo = false;
    }

    /**
     * Reactivar producto
     */
    public void reactivar() {
        this.activo = true;
    }

    @Override
    public String toString() {
        return "Producto{" +
                "productoId=" + productoId +
                ", codigoProducto='" + codigoProducto + '\'' +
                ", nombreProducto='" + nombreProducto + '\'' +
                ", precioUnitario=" + precioUnitario +
                ", activo=" + activo +
                '}';
    }
}
