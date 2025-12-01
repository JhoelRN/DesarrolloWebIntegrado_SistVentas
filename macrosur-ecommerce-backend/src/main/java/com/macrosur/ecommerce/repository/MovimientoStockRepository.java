package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.Inventario;
import com.macrosur.ecommerce.entity.MovimientoStock;
import com.macrosur.ecommerce.entity.VarianteProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MovimientoStockRepository extends JpaRepository<MovimientoStock, Long> {
    
    List<MovimientoStock> findByInventarioOrderByFechaMovimientoDesc(Inventario inventario);
    
    @Query("SELECT m FROM MovimientoStock m WHERE m.tipoMovimiento = 'SALIDA_VENTA' " +
           "AND m.inventario.variante = :variante AND m.fechaMovimiento >= :fechaInicio")
    List<MovimientoStock> findVentasByVarianteAndFecha(
        @Param("variante") VarianteProducto variante,
        @Param("fechaInicio") LocalDateTime fechaInicio
    );
    
    @Query("SELECT SUM(m.cantidad) FROM MovimientoStock m " +
           "WHERE m.inventario.variante = :variante AND m.tipoMovimiento = 'SALIDA_VENTA' " +
           "AND m.fechaMovimiento >= :fechaInicio")
    Integer calcularVelocidadVenta(
        @Param("variante") VarianteProducto variante,
        @Param("fechaInicio") LocalDateTime fechaInicio
    );
}
