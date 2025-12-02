package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.dto.CategoriaDTO;
import com.macrosur.ecommerce.dto.CategoriaSaveDTO;
import com.macrosur.ecommerce.entity.Categoria;
import com.macrosur.ecommerce.entity.Producto;
import com.macrosur.ecommerce.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de Categorías
 * Maneja la lógica de negocio para CRUD y jerarquía de categorías
 */
@Service
@Transactional
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    /**
     * Obtener todas las categorías
     */
    public List<CategoriaDTO> obtenerTodas() {
        return categoriaRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener todas las categorías activas
     */
    public List<CategoriaDTO> obtenerActivas() {
        return categoriaRepository.findByActivoTrue().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener árbol de categorías (solo raíz con subcategorías)
     */
    public List<CategoriaDTO> obtenerArbol() {
        List<Categoria> raices = categoriaRepository.findCategoriasRaizActivas();
        return raices.stream()
                .map(this::convertirADTOConSubcategorias)
                .collect(Collectors.toList());
    }

    /**
     * Obtener categorías visibles para clientes (para catálogo público)
     */
    public List<CategoriaDTO> obtenerVisiblesCliente() {
        return categoriaRepository.findCategoriasVisiblesCliente().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener categoría por ID
     */
    public CategoriaDTO obtenerPorId(Integer id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));
        return convertirADTOConSubcategorias(categoria);
    }

    /**
     * Crear nueva categoría
     */
    public CategoriaDTO crear(CategoriaSaveDTO dto) {
        // Validar nombre único
        if (categoriaRepository.existsByNombre(dto.getNombre())) {
            throw new RuntimeException("Ya existe una categoría con el nombre: " + dto.getNombre());
        }

        Categoria categoria = new Categoria();
        mapearDTOAEntidad(dto, categoria);

        // Si tiene categoría padre, validar que existe
        if (dto.getCategoriaPadreId() != null) {
            Categoria padre = categoriaRepository.findById(dto.getCategoriaPadreId())
                    .orElseThrow(() -> new RuntimeException("Categoría padre no encontrada con ID: " + dto.getCategoriaPadreId()));
            categoria.setCategoriaPadre(padre);
        }

        Categoria guardada = categoriaRepository.save(categoria);
        return convertirADTO(guardada);
    }

    /**
     * Actualizar categoría existente
     */
    public CategoriaDTO actualizar(Integer id, CategoriaSaveDTO dto) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));

        // Validar nombre único (excluyendo la categoría actual)
        if (categoriaRepository.existsByNombreAndIdNot(dto.getNombre(), id)) {
            throw new RuntimeException("Ya existe otra categoría con el nombre: " + dto.getNombre());
        }

        // Validar que no se asigne a sí misma como padre
        if (dto.getCategoriaPadreId() != null && dto.getCategoriaPadreId().equals(id)) {
            throw new RuntimeException("Una categoría no puede ser su propia categoría padre");
        }

        mapearDTOAEntidad(dto, categoria);

        // Actualizar categoría padre
        if (dto.getCategoriaPadreId() != null) {
            Categoria padre = categoriaRepository.findById(dto.getCategoriaPadreId())
                    .orElseThrow(() -> new RuntimeException("Categoría padre no encontrada con ID: " + dto.getCategoriaPadreId()));
            
            // Validar que no se cree un ciclo en la jerarquía
            if (esCicloJerarquia(padre, id)) {
                throw new RuntimeException("No se puede crear una jerarquía circular de categorías");
            }
            
            categoria.setCategoriaPadre(padre);
        } else {
            categoria.setCategoriaPadre(null);
        }

        Categoria actualizada = categoriaRepository.save(categoria);
        return convertirADTO(actualizada);
    }

    /**
     * Soft delete - marcar categoría como inactiva
     */
    public void softDelete(Integer id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));
        
        // Desactivar también las subcategorías
        desactivarSubcategorias(categoria);
        
        categoria.setActivo(false);
        categoriaRepository.save(categoria);
    }

    /**
     * Hard delete - eliminar permanentemente
     * Desactiva productos asociados automáticamente
     */
    public void hardDelete(Integer id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));

        // Verificar si tiene subcategorías
        if (!categoria.getSubcategorias().isEmpty()) {
            throw new RuntimeException("No se puede eliminar la categoría porque tiene subcategorías asociadas");
        }

        // Desactivar productos que solo tienen esta categoría
        desactivarProductosSinCategorias(categoria);

        categoriaRepository.delete(categoria);
    }
    
    /**
     * Desactivar productos que quedarían sin categorías al eliminar esta
     */
    private void desactivarProductosSinCategorias(Categoria categoria) {
        for (Producto producto : categoria.getProductos()) {
            // Si el producto solo tiene esta categoría, desactivarlo
            if (producto.getCategorias().size() == 1) {
                producto.setActivo(false);
            }
            // Remover esta categoría del producto
            producto.getCategorias().remove(categoria);
        }
    }

    /**
     * Reactivar categoría
     */
    public void reactivar(Integer id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));
        categoria.setActivo(true);
        categoriaRepository.save(categoria);
    }

    /**
     * Buscar categorías por nombre
     */
    public List<CategoriaDTO> buscarPorNombre(String searchTerm) {
        return categoriaRepository.searchByNombre(searchTerm).stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // ========== MÉTODOS PRIVADOS DE UTILIDAD ==========

    /**
     * Convertir entidad a DTO básico
     */
    private CategoriaDTO convertirADTO(Categoria categoria) {
        CategoriaDTO dto = new CategoriaDTO();
        dto.setCategoriaId(categoria.getCategoriaId());
        dto.setNombre(categoria.getNombre());
        dto.setDescripcion(categoria.getDescripcion());
        dto.setVisibleCliente(categoria.getVisibleCliente());
        dto.setActivo(categoria.getActivo());
        dto.setNivel(categoria.getNivel());
        
        if (categoria.getCategoriaPadre() != null) {
            dto.setCategoriaPadreId(categoria.getCategoriaPadre().getCategoriaId());
            dto.setCategoriaPadreNombre(categoria.getCategoriaPadre().getNombre());
        }
        
        // Contar productos asociados
        Long cantidadProductos = categoriaRepository.countProductosByCategoria(categoria.getCategoriaId());
        dto.setCantidadProductos(cantidadProductos.intValue());
        
        return dto;
    }

    /**
     * Convertir entidad a DTO con subcategorías (recursivo)
     */
    private CategoriaDTO convertirADTOConSubcategorias(Categoria categoria) {
        CategoriaDTO dto = convertirADTO(categoria);
        
        // Convertir subcategorías recursivamente
        List<CategoriaDTO> subcategoriasDTO = categoria.getSubcategorias().stream()
                .filter(Categoria::getActivo)
                .map(this::convertirADTOConSubcategorias)
                .collect(Collectors.toList());
        
        dto.setSubcategorias(subcategoriasDTO);
        
        return dto;
    }

    /**
     * Mapear DTO a entidad
     */
    private void mapearDTOAEntidad(CategoriaSaveDTO dto, Categoria categoria) {
        categoria.setNombre(dto.getNombre());
        categoria.setDescripcion(dto.getDescripcion());
        categoria.setVisibleCliente(dto.getVisibleCliente() != null ? dto.getVisibleCliente() : true);
        categoria.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
    }

    /**
     * Verificar si hay un ciclo en la jerarquía
     * Evita que una categoría sea padre de uno de sus ancestros
     */
    private boolean esCicloJerarquia(Categoria candidatoPadre, Integer categoriaId) {
        Categoria actual = candidatoPadre;
        while (actual != null) {
            if (actual.getCategoriaId().equals(categoriaId)) {
                return true;
            }
            actual = actual.getCategoriaPadre();
        }
        return false;
    }

    /**
     * Desactivar recursivamente todas las subcategorías
     */
    private void desactivarSubcategorias(Categoria categoria) {
        for (Categoria subcategoria : categoria.getSubcategorias()) {
            subcategoria.setActivo(false);
            categoriaRepository.save(subcategoria);
            desactivarSubcategorias(subcategoria);
        }
    }
}
