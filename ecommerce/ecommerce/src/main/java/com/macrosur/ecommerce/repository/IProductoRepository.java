package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.model.entity.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

// JpaRepository proporciona los métodos CRUD básicos por defecto
public interface IProductoRepository extends JpaRepository<Producto, Long> {

    // Método personalizado para buscar productos activos por Categoría ID
    List<Producto> findByCategoriaIdAndActivoTrue(Integer categoriaId);

    // Método para buscar productos activos por nombre (usado en la barra de búsqueda)
    List<Producto> findByNombreContainingIgnoreCaseAndActivoTrue(String nombre);
}