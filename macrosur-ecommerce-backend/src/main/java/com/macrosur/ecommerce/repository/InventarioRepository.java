package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.Inventario;
import com.macrosur.ecommerce.entity.UbicacionInventario;
import com.macrosur.ecommerce.entity.VarianteProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventarioRepository extends JpaRepository<Inventario, Integer> {
    
    Optional<Inventario> findByVarianteAndUbicacion(VarianteProducto variante, UbicacionInventario ubicacion);
    
    List<Inventario> findByUbicacion(UbicacionInventario ubicacion);
    
    List<Inventario> findByVariante(VarianteProducto variante);
    
    @Query("SELECT i FROM Inventario i WHERE i.cantidad < i.stockMinimoSeguridad")
    List<Inventario> findStockBajo();
    
    @Query("SELECT i FROM Inventario i WHERE i.cantidad = 0")
    List<Inventario> findStockCero();
}
