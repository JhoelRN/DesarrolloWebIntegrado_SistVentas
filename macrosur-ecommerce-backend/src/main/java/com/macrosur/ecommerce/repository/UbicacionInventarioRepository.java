package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.UbicacionInventario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UbicacionInventarioRepository extends JpaRepository<UbicacionInventario, Integer> {
    List<UbicacionInventario> findByEsFisica(Boolean esFisica);
}
