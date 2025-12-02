package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.DetalleOrdenReposicion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DetalleOrdenReposicionRepository extends JpaRepository<DetalleOrdenReposicion, Integer> {
}
