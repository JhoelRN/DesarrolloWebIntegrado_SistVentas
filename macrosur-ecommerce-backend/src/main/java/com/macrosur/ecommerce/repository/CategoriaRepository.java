package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository para la entidad Categoria
 * Proporciona métodos de acceso a datos para categorías con soporte de jerarquía
 */
@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Integer> {
    
    /**
     * Buscar categoría por nombre (único en DB)
     */
    Optional<Categoria> findByNombre(String nombre);

    /**
     * Buscar todas las categorías raíz (sin padre)
     */
    @Query("SELECT c FROM Categoria c WHERE c.categoriaPadre IS NULL")
    List<Categoria> findCategoriasRaiz();

    /**
     * Buscar subcategorías de una categoría padre
     */
    @Query("SELECT c FROM Categoria c WHERE c.categoriaPadre.categoriaId = :padreId")
    List<Categoria> findSubcategorias(@Param("padreId") Integer padreId);

    /**
     * Buscar todas las categorías activas
     */
    List<Categoria> findByActivoTrue();

    /**
     * Buscar categorías visibles para clientes
     */
    @Query("SELECT c FROM Categoria c WHERE c.visibleCliente = true AND c.activo = true")
    List<Categoria> findCategoriasVisiblesCliente();

    /**
     * Buscar categorías raíz activas
     */
    @Query("SELECT c FROM Categoria c WHERE c.categoriaPadre IS NULL AND c.activo = true")
    List<Categoria> findCategoriasRaizActivas();

    /**
     * Contar productos por categoría
     */
    @Query("SELECT COUNT(p) FROM Producto p JOIN p.categorias c WHERE c.categoriaId = :categoriaId")
    Long countProductosByCategoria(@Param("categoriaId") Integer categoriaId);

    /**
     * Verificar si existe una categoría con ese nombre (para validación de duplicados)
     */
    boolean existsByNombre(String nombre);

    /**
     * Verificar si existe una categoría con ese nombre excluyendo un ID específico
     * (útil para ediciones)
     */
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Categoria c WHERE c.nombre = :nombre AND c.categoriaId <> :categoriaId")
    boolean existsByNombreAndIdNot(@Param("nombre") String nombre, @Param("categoriaId") Integer categoriaId);

    /**
     * Buscar categorías que contienen un texto en el nombre (búsqueda parcial)
     */
    @Query("SELECT c FROM Categoria c WHERE LOWER(c.nombre) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Categoria> searchByNombre(@Param("searchTerm") String searchTerm);

    /**
     * Obtener árbol completo de categorías con eager loading de subcategorías
     * Solo para categorías raíz activas
     */
    @Query("SELECT DISTINCT c FROM Categoria c " +
           "LEFT JOIN FETCH c.subcategorias " +
           "WHERE c.categoriaPadre IS NULL AND c.activo = true " +
           "ORDER BY c.nombre")
    List<Categoria> findArbolCategoriasActivas();
}
