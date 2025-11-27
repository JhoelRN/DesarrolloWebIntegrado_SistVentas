package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

/**
 * Repository para la entidad Producto
 * Proporciona métodos de acceso a datos con soporte de filtros y paginación
 * JpaSpecificationExecutor permite usar Specifications para filtros dinámicos
 */
@Repository
public interface ProductoRepository extends JpaRepository<Producto, Integer>, JpaSpecificationExecutor<Producto> {
    
    /**
     * Buscar producto por código (único en DB)
     */
    Optional<Producto> findByCodigoProducto(String codigoProducto);

    /**
     * Buscar productos activos
     */
    Page<Producto> findByActivoTrue(Pageable pageable);

    /**
     * Buscar productos por nombre (búsqueda parcial)
     */
    @Query("SELECT p FROM Producto p WHERE LOWER(p.nombreProducto) LIKE LOWER(CONCAT('%', :searchTerm, '%')) AND p.activo = true")
    Page<Producto> searchByNombre(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Buscar productos por código o nombre
     */
    @Query("SELECT p FROM Producto p WHERE " +
           "(LOWER(p.codigoProducto) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.nombreProducto) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND p.activo = true")
    Page<Producto> searchByCodigoOrNombre(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Buscar productos por categoría
     */
    @Query("SELECT DISTINCT p FROM Producto p JOIN p.categorias c WHERE c.categoriaId = :categoriaId AND p.activo = true")
    Page<Producto> findByCategoria(@Param("categoriaId") Integer categoriaId, Pageable pageable);

    /**
     * Buscar productos por rango de precios
     */
    @Query("SELECT p FROM Producto p WHERE p.precioUnitario BETWEEN :precioMin AND :precioMax AND p.activo = true")
    Page<Producto> findByPrecioRange(@Param("precioMin") BigDecimal precioMin, 
                                     @Param("precioMax") BigDecimal precioMax, 
                                     Pageable pageable);

    /**
     * Búsqueda avanzada con múltiples filtros
     * @param searchTerm búsqueda en código y nombre
     * @param categoriaId filtro por categoría (null = todos)
     * @param precioMin precio mínimo (null = sin límite)
     * @param precioMax precio máximo (null = sin límite)
     */
    @Query("SELECT DISTINCT p FROM Producto p " +
           "LEFT JOIN p.categorias c " +
           "WHERE p.activo = true " +
           "AND (:searchTerm IS NULL OR LOWER(p.codigoProducto) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR LOWER(p.nombreProducto) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "AND (:categoriaId IS NULL OR c.categoriaId = :categoriaId) " +
           "AND (:precioMin IS NULL OR p.precioUnitario >= :precioMin) " +
           "AND (:precioMax IS NULL OR p.precioUnitario <= :precioMax)")
    Page<Producto> findWithFilters(@Param("searchTerm") String searchTerm,
                                   @Param("categoriaId") Integer categoriaId,
                                   @Param("precioMin") BigDecimal precioMin,
                                   @Param("precioMax") BigDecimal precioMax,
                                   Pageable pageable);

    /**
     * Verificar si existe un producto con ese código
     */
    boolean existsByCodigoProducto(String codigoProducto);

    /**
     * Verificar si existe un producto con ese código excluyendo un ID específico
     */
    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Producto p WHERE p.codigoProducto = :codigo AND p.productoId <> :productoId")
    boolean existsByCodigoProductoAndIdNot(@Param("codigo") String codigo, @Param("productoId") Integer productoId);

    /**
     * Contar productos activos
     */
    long countByActivoTrue();

    /**
     * Contar productos inactivos
     */
    long countByActivoFalse();

    /**
     * Obtener productos sin categorías asignadas
     */
    @Query("SELECT p FROM Producto p WHERE p.categorias IS EMPTY")
    List<Producto> findProductosSinCategorias();

    /**
     * Buscar productos relacionados por categorías compartidas
     * Excluye el producto actual
     */
    @Query("SELECT DISTINCT p FROM Producto p " +
           "JOIN p.categorias c " +
           "WHERE c.categoriaId IN :categoriasIds " +
           "AND p.productoId <> :productoId " +
           "AND p.activo = true")
    List<Producto> findRelacionados(@Param("categoriasIds") List<Integer> categoriasIds, 
                                    @Param("productoId") Integer productoId, 
                                    Pageable pageable);
}
