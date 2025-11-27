package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

/**
 * Entidad Categoria - Representa una categoría de productos con soporte para jerarquía padre-hijo
 * Mapea a la tabla 'categorias' en la base de datos
 */
@Entity
@Table(name = "categorias")
public class Categoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "categoria_id")
    private Integer categoriaId;

    @Column(name = "nombre", nullable = false, length = 100, unique = true)
    private String nombre;

    @Column(name = "descripcion", columnDefinition = "TEXT")
    private String descripcion;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoria_padre_id")
    private Categoria categoriaPadre;

    @OneToMany(mappedBy = "categoriaPadre", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Categoria> subcategorias = new HashSet<>();

    @Column(name = "visible_cliente", nullable = false)
    private Boolean visibleCliente = true;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @ManyToMany(mappedBy = "categorias", fetch = FetchType.LAZY)
    private Set<Producto> productos = new HashSet<>();

    // Constructores
    public Categoria() {
    }

    public Categoria(String nombre, String descripcion) {
        this.nombre = nombre;
        this.descripcion = descripcion;
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

    public Categoria getCategoriaPadre() {
        return categoriaPadre;
    }

    public void setCategoriaPadre(Categoria categoriaPadre) {
        this.categoriaPadre = categoriaPadre;
    }

    public Set<Categoria> getSubcategorias() {
        return subcategorias;
    }

    public void setSubcategorias(Set<Categoria> subcategorias) {
        this.subcategorias = subcategorias;
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

    public Set<Producto> getProductos() {
        return productos;
    }

    public void setProductos(Set<Producto> productos) {
        this.productos = productos;
    }

    // Métodos de utilidad
    public void addSubcategoria(Categoria subcategoria) {
        subcategorias.add(subcategoria);
        subcategoria.setCategoriaPadre(this);
    }

    public void removeSubcategoria(Categoria subcategoria) {
        subcategorias.remove(subcategoria);
        subcategoria.setCategoriaPadre(null);
    }

    /**
     * Verifica si esta categoría es una categoría raíz (sin padre)
     */
    public boolean esRaiz() {
        return categoriaPadre == null;
    }

    /**
     * Obtiene el nivel de profundidad en el árbol de categorías
     * Nivel 0 = categoría raíz
     */
    public int getNivel() {
        int nivel = 0;
        Categoria padre = categoriaPadre;
        while (padre != null) {
            nivel++;
            padre = padre.getCategoriaPadre();
        }
        return nivel;
    }

    @Override
    public String toString() {
        return "Categoria{" +
                "categoriaId=" + categoriaId +
                ", nombre='" + nombre + '\'' +
                ", activo=" + activo +
                ", visibleCliente=" + visibleCliente +
                '}';
    }
}
