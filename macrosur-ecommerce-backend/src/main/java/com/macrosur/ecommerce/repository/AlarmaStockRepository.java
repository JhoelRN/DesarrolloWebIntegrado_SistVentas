package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.AlarmaStock;
import com.macrosur.ecommerce.entity.Inventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlarmaStockRepository extends JpaRepository<AlarmaStock, Integer> {
    
    List<AlarmaStock> findByResueltaOrderByFechaCreacionDesc(Boolean resuelta);
    
    Optional<AlarmaStock> findByInventarioAndResuelta(
        Inventario inventario,
        Boolean resuelta
    );
    
    List<AlarmaStock> findByInventario_VarianteVarianteIdAndResuelta(Integer varianteId, Boolean resuelta);
}
