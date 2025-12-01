package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.ReglaDescuento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Repositorio JPA para ReglaDescuento
 * Patrón: DAO (Data Access Object)
 * 
 * Proporciona acceso a datos de promociones con métodos CRUD
 * y consultas personalizadas para filtrado avanzado
 */
@Repository
public interface ReglaDescuentoRepository extends JpaRepository<ReglaDescuento, Integer> {

    /**
     * Buscar promociones por nombre (búsqueda parcial)
     */
    List<ReglaDescuento> findByNombreReglaContainingIgnoreCase(String nombre);

    /**
     * Buscar promociones por tipo de descuento
     */
    List<ReglaDescuento> findByTipoDescuento(ReglaDescuento.TipoDescuento tipo);

    /**
     * Obtener todas las promociones activas en este momento
     * Una promoción está activa si:
     * - No tiene fecha_inicio O ya pasó la fecha_inicio
     * - No tiene fecha_fin O aún no llegó la fecha_fin
     */
    @Query("""
        SELECT r FROM ReglaDescuento r 
        WHERE (r.fechaInicio IS NULL OR r.fechaInicio <= :ahora) 
        AND (r.fechaFin IS NULL OR r.fechaFin >= :ahora)
        ORDER BY r.fechaInicio DESC
    """)
    List<ReglaDescuento> findPromocionesActivas(LocalDateTime ahora);

    /**
     * Obtener promociones acumulables
     */
    List<ReglaDescuento> findByAcumulableTrue();

    /**
     * Obtener promociones exclusivas
     */
    List<ReglaDescuento> findByExclusivoTrue();

    /**
     * Contar promociones activas
     */
    @Query("""
        SELECT COUNT(r) FROM ReglaDescuento r 
        WHERE (r.fechaInicio IS NULL OR r.fechaInicio <= :ahora) 
        AND (r.fechaFin IS NULL OR r.fechaFin >= :ahora)
    """)
    long contarPromocionesActivas(LocalDateTime ahora);

    /**
     * Buscar promociones que expiran en los próximos N días
     */
    @Query("""
        SELECT r FROM ReglaDescuento r 
        WHERE r.fechaFin IS NOT NULL 
        AND r.fechaFin BETWEEN :inicio AND :fin
        ORDER BY r.fechaFin ASC
    """)
    List<ReglaDescuento> findPromocionesProximasExpirar(LocalDateTime inicio, LocalDateTime fin);
}
