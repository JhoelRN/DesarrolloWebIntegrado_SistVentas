package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.dto.CategoriaDTO;
import com.macrosur.ecommerce.dto.ProductoDTO;
import com.macrosur.ecommerce.dto.ProductoListDTO;
import com.macrosur.ecommerce.dto.ProductoSaveDTO;
import com.macrosur.ecommerce.entity.Categoria;
import com.macrosur.ecommerce.entity.Producto;
import com.macrosur.ecommerce.repository.CategoriaRepository;
import com.macrosur.ecommerce.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Servicio para la gestión de Productos
 * Maneja la lógica de negocio para CRUD, filtros y paginación de productos
 */
@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    /**
     * Listar productos con paginación y filtros
     * @param searchTerm búsqueda por código o nombre
     * @param categoriaId filtro por categoría
     * @param precioMin precio mínimo
     * @param precioMax precio máximo
     * @param page número de página (0-indexed)
     * @param size tamaño de página
     * @param sortBy campo de ordenamiento
     * @param sortDir dirección de ordenamiento (asc/desc)
     */
    public Page<ProductoListDTO> listarConFiltros(String searchTerm, Integer categoriaId,
                                                   BigDecimal precioMin, BigDecimal precioMax,
                                                   int page, int size, String sortBy, String sortDir) {
        
        // Crear ordenamiento
        Sort sort = sortDir.equalsIgnoreCase("desc") 
                ? Sort.by(sortBy).descending() 
                : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);

        // Aplicar filtros
        Page<Producto> productos;
        
        if (searchTerm == null && categoriaId == null && precioMin == null && precioMax == null) {
            // Sin filtros - listar todos los activos
            productos = productoRepository.findByActivoTrue(pageable);
        } else {
            // Con filtros - usar query personalizada
            productos = productoRepository.findWithFilters(searchTerm, categoriaId, precioMin, precioMax, pageable);
        }

        return productos.map(this::convertirAListDTO);
    }

    /**
     * Obtener producto por ID (información completa)
     */
    public ProductoDTO obtenerPorId(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        return convertirADTO(producto);
    }

    /**
     * Crear nuevo producto
     */
    public ProductoDTO crear(ProductoSaveDTO dto) {
        // Validar código único (si se proporciona)
        if (dto.getCodigoProducto() != null && !dto.getCodigoProducto().isBlank()) {
            if (productoRepository.existsByCodigoProducto(dto.getCodigoProducto())) {
                throw new RuntimeException("Ya existe un producto con el código: " + dto.getCodigoProducto());
            }
        }

        // Validar que tenga al menos una categoría
        if (dto.getCategoriasIds() == null || dto.getCategoriasIds().isEmpty()) {
            throw new RuntimeException("El producto debe tener al menos una categoría asignada");
        }

        Producto producto = new Producto();
        mapearDTOAEntidad(dto, producto);

        // Asignar categorías
        asignarCategorias(producto, dto.getCategoriasIds());

        Producto guardado = productoRepository.save(producto);
        return convertirADTO(guardado);
    }

    /**
     * Actualizar producto existente
     */
    public ProductoDTO actualizar(Integer id, ProductoSaveDTO dto) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        // Validar código único (si se cambió)
        if (dto.getCodigoProducto() != null && !dto.getCodigoProducto().isBlank()) {
            if (productoRepository.existsByCodigoProductoAndIdNot(dto.getCodigoProducto(), id)) {
                throw new RuntimeException("Ya existe otro producto con el código: " + dto.getCodigoProducto());
            }
        }

        // Validar que tenga al menos una categoría
        if (dto.getCategoriasIds() == null || dto.getCategoriasIds().isEmpty()) {
            throw new RuntimeException("El producto debe tener al menos una categoría asignada");
        }

        mapearDTOAEntidad(dto, producto);

        // Actualizar categorías (limpiar y reasignar)
        producto.clearCategorias();
        asignarCategorias(producto, dto.getCategoriasIds());

        Producto actualizado = productoRepository.save(producto);
        return convertirADTO(actualizado);
    }

    /**
     * Soft delete - marcar producto como inactivo
     */
    public void softDelete(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        producto.softDelete();
        productoRepository.save(producto);
    }

    /**
     * Hard delete - eliminar permanentemente
     * Solo si no tiene relaciones críticas (pedidos, inventario, etc.)
     */
    public void hardDelete(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));

        // TODO: Validar que no tenga pedidos asociados antes de eliminar
        // Por ahora, permitimos eliminación directa
        
        productoRepository.delete(producto);
    }

    /**
     * Reactivar producto
     */
    public void reactivar(Integer id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        producto.reactivar();
        productoRepository.save(producto);
    }

    /**
     * Cambiar estado activo de un producto
     */
    public void cambiarEstado(Integer id, Boolean activo) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        producto.setActivo(activo);
        productoRepository.save(producto);
    }

    /**
     * Obtener productos relacionados (por categorías compartidas)
     */
    public List<ProductoListDTO> obtenerRelacionados(Integer productoId, int limit) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + productoId));

        List<Integer> categoriasIds = producto.getCategorias().stream()
                .map(Categoria::getCategoriaId)
                .collect(Collectors.toList());

        if (categoriasIds.isEmpty()) {
            return List.of();
        }

        Pageable pageable = PageRequest.of(0, limit);
        List<Producto> relacionados = productoRepository.findRelacionados(categoriasIds, productoId, pageable);
        
        return relacionados.stream()
                .map(this::convertirAListDTO)
                .collect(Collectors.toList());
    }

    /**
     * Contar productos activos e inactivos
     */
    public ProductoStats obtenerEstadisticas() {
        long activos = productoRepository.countByActivoTrue();
        long inactivos = productoRepository.countByActivoFalse();
        return new ProductoStats(activos, inactivos);
    }

    // ========== MÉTODOS PRIVADOS DE UTILIDAD ==========

    /**
     * Convertir entidad a DTO completo
     */
    private ProductoDTO convertirADTO(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setProductoId(producto.getProductoId());
        dto.setCodigoProducto(producto.getCodigoProducto());
        dto.setNombreProducto(producto.getNombreProducto());
        dto.setDescripcionCorta(producto.getDescripcionCorta());
        dto.setFichaTecnicaHtml(producto.getFichaTecnicaHtml());
        dto.setPrecioUnitario(producto.getPrecioUnitario());
        dto.setPesoKg(producto.getPesoKg());
        dto.setVolumenM3(producto.getVolumenM3());
        dto.setFechaCreacion(producto.getFechaCreacion());
        dto.setActivo(producto.getActivo());
        dto.setImagenUrl(producto.getImagenUrl());

        // Convertir categorías
        List<CategoriaDTO> categoriasDTO = producto.getCategorias().stream()
                .map(this::convertirCategoriaADTO)
                .collect(Collectors.toList());
        dto.setCategorias(categoriasDTO);

        return dto;
    }

    /**
     * Convertir entidad a DTO simplificado (para listados)
     */
    private ProductoListDTO convertirAListDTO(Producto producto) {
        ProductoListDTO dto = new ProductoListDTO();
        dto.setProductoId(producto.getProductoId());
        dto.setCodigoProducto(producto.getCodigoProducto());
        dto.setNombreProducto(producto.getNombreProducto());
        dto.setDescripcionCorta(producto.getDescripcionCorta());
        dto.setPrecioUnitario(producto.getPrecioUnitario());
        dto.setPesoKg(producto.getPesoKg());
        dto.setVolumenM3(producto.getVolumenM3());
        dto.setFichaTecnicaHtml(producto.getFichaTecnicaHtml());
        dto.setActivo(producto.getActivo());
        dto.setImagenUrl(producto.getImagenUrl());
        dto.setFechaCreacion(producto.getFechaCreacion());

        // Convertir categorías a string concatenado y lista completa
        List<CategoriaDTO> categoriasDTO = producto.getCategorias().stream()
                .map(this::convertirCategoriaADTO)
                .collect(Collectors.toList());
        dto.setCategoriasFromList(categoriasDTO);
        dto.setCategorias(categoriasDTO);

        return dto;
    }

    /**
     * Convertir categoría a DTO simplificado
     */
    private CategoriaDTO convertirCategoriaADTO(Categoria categoria) {
        CategoriaDTO dto = new CategoriaDTO();
        dto.setCategoriaId(categoria.getCategoriaId());
        dto.setNombre(categoria.getNombre());
        dto.setActivo(categoria.getActivo());
        return dto;
    }

    /**
     * Mapear DTO a entidad
     */
    private void mapearDTOAEntidad(ProductoSaveDTO dto, Producto producto) {
        producto.setCodigoProducto(dto.getCodigoProducto());
        producto.setNombreProducto(dto.getNombreProducto());
        producto.setDescripcionCorta(dto.getDescripcionCorta());
        producto.setFichaTecnicaHtml(dto.getFichaTecnicaHtml());
        producto.setPrecioUnitario(dto.getPrecioUnitario());
        producto.setPesoKg(dto.getPesoKg());
        producto.setVolumenM3(dto.getVolumenM3());
        producto.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        producto.setImagenUrl(dto.getImagenUrl());
    }

    /**
     * Asignar categorías al producto desde lista de IDs
     */
    private void asignarCategorias(Producto producto, Set<Integer> categoriasIds) {
        Set<Categoria> categorias = new HashSet<>();
        
        for (Integer categoriaId : categoriasIds) {
            Categoria categoria = categoriaRepository.findById(categoriaId)
                    .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + categoriaId));
            
            // Validar que la categoría esté activa
            if (!categoria.getActivo()) {
                throw new RuntimeException("No se puede asignar la categoría inactiva: " + categoria.getNombre());
            }
            
            categorias.add(categoria);
        }

        // Asignar todas las categorías
        for (Categoria categoria : categorias) {
            producto.addCategoria(categoria);
        }
    }

    /**
     * Clase interna para estadísticas de productos
     */
    public static class ProductoStats {
        private long activos;
        private long inactivos;

        public ProductoStats(long activos, long inactivos) {
            this.activos = activos;
            this.inactivos = inactivos;
        }

        public long getActivos() { return activos; }
        public long getInactivos() { return inactivos; }
        public long getTotal() { return activos + inactivos; }
    }
}
