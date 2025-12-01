package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.VarianteProducto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VarianteProductoRepository extends JpaRepository<VarianteProducto, Integer> {
    Optional<VarianteProducto> findBySku(String sku);
    boolean existsBySku(String sku);
}
