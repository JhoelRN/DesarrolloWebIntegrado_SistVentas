package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.model.entity.Producto;
import java.util.List;
import java.util.Optional;

// Patrón: Programación a una Interfaz (para desacoplamiento)
public interface IProductoService {

    // Métodos para el ADMIN
    Producto guardarOActualizar(Producto producto);
    void eliminarProducto(Long id);
    Optional<Producto> obtenerPorIdAdmin(Long id); // Incluye productos inactivos
    List<Producto> obtenerTodosAdmin(); // Lista completa para el Admin

    // Métodos para el PÚBLICO
    List<Producto> obtenerActivos();
    Optional<Producto> obtenerActivoPorId(Long id);
    List<Producto> buscarPorCategoria(Integer categoriaId);
    List<Producto> buscarPorNombre(String nombre);
}