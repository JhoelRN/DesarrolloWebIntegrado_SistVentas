package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.OperadorLogistico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OperadorLogisticoRepository extends JpaRepository<OperadorLogistico, Integer> {
}
