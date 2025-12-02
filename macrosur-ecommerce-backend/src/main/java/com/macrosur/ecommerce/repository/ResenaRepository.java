package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.Resena;
import com.macrosur.ecommerce.entity.Resena.EstadoResena;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository para gestionar reseñas de productos
 */
@Repository
public interface ResenaRepository extends JpaRepository<Resena, Long> {

    /**
     * Buscar reseñas por producto (solo aprobadas para clientes)
     */
    @Query("SELECT r FROM Resena r WHERE r.producto.productoId = :productoId AND r.estadoResena = 'Aprobada' ORDER BY r.fechaResena DESC")
    Page<Resena> findAprobadasByProductoId(@Param("productoId") Integer productoId, Pageable pageable);

    /**
     * Buscar todas las reseñas de un producto (para admin)
     */
    @Query("SELECT r FROM Resena r WHERE r.producto.productoId = :productoId ORDER BY r.fechaResena DESC")
    Page<Resena> findAllByProductoId(@Param("productoId") Integer productoId, Pageable pageable);

    /**
     * Buscar reseñas por cliente
     */
    @Query("SELECT r FROM Resena r WHERE r.cliente.clienteId = :clienteId ORDER BY r.fechaResena DESC")
    List<Resena> findByClienteId(@Param("clienteId") Long clienteId);

    /**
     * Buscar reseñas por estado
     */
    Page<Resena> findByEstadoResena(EstadoResena estado, Pageable pageable);

    /**
     * Verificar si un cliente ya reseñó un producto
     */
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Resena r WHERE r.cliente.clienteId = :clienteId AND r.producto.productoId = :productoId")
    boolean existsByClienteIdAndProductoId(@Param("clienteId") Long clienteId, @Param("productoId") Integer productoId);

    /**
     * Obtener reseña de un cliente para un producto
     */
    @Query("SELECT r FROM Resena r WHERE r.cliente.clienteId = :clienteId AND r.producto.productoId = :productoId")
    Optional<Resena> findByClienteIdAndProductoId(@Param("clienteId") Long clienteId, @Param("productoId") Integer productoId);

    /**
     * Calcular promedio de calificación de un producto (solo aprobadas)
     */
    @Query("SELECT AVG(r.calificacion) FROM Resena r WHERE r.producto.productoId = :productoId AND r.estadoResena = 'Aprobada'")
    Double calcularPromedioCalificacion(@Param("productoId") Integer productoId);

    /**
     * Contar reseñas aprobadas de un producto
     */
    @Query("SELECT COUNT(r) FROM Resena r WHERE r.producto.productoId = :productoId AND r.estadoResena = 'Aprobada'")
    Long contarResenasAprobadas(@Param("productoId") Integer productoId);

    /**
     * Obtener cantidad de reseñas por calificación de un producto
     */
    @Query("SELECT r.calificacion, COUNT(r) FROM Resena r WHERE r.producto.productoId = :productoId AND r.estadoResena = 'Aprobada' GROUP BY r.calificacion")
    List<Object[]> contarPorCalificacion(@Param("productoId") Integer productoId);

    /**
     * Contar reseñas pendientes de moderación
     */
    @Query("SELECT COUNT(r) FROM Resena r WHERE r.estadoResena = 'Pendiente'")
    Long contarPendientes();
}
