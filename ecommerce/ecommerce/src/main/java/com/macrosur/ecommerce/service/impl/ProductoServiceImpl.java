package com.macrosur.ecommerce.service.impl;

import com.macrosur.ecommerce.exception.ResourceNotFoundException;
import com.macrosur.ecommerce.model.entity.Producto;
import com.macrosur.ecommerce.repository.IProductoRepository;
import com.macrosur.ecommerce.service.IProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoServiceImpl implements IProductoService {

    @Autowired
    private IProductoRepository productoRepository;

    // --- Métodos de ADMIN ---
    @Override
    public Producto guardarOActualizar(Producto producto) {
        // Lógica de negocio de validación antes de guardar
        return productoRepository.save(producto);
    }

    @Override
    public void eliminarProducto(Long id) {
        // En un e-commerce, es mejor 'desactivar' que eliminar físicamente
        Producto p = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        p.setActivo(false); // Eliminación lógica
        productoRepository.save(p);
    }

    @Override
    public Optional<Producto> obtenerPorIdAdmin(Long id) {
        return productoRepository.findById(id);
    }

    @Override
    public List<Producto> obtenerTodosAdmin() {
        return productoRepository.findAll();
    }

    // --- Métodos de PÚBLICO ---
    @Override
    public List<Producto> obtenerActivos() {
        return productoRepository.findByActivoTrue(); // Asumiendo que definimos este en IProductoRepository
    }

    @Override
    public Optional<Producto> obtenerActivoPorId(Long id) {
        return productoRepository.findById(id)
                .filter(Producto::getActivo); // Solo si está activo
    }

    @Override
    public List<Producto> buscarPorCategoria(Integer categoriaId) {
        return productoRepository.findByCategoriaIdAndActivoTrue(categoriaId);
    }

    @Override
    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCaseAndActivoTrue(nombre);
    }
}