package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.SeguimientoDespacho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeguimientoDespachoRepository extends JpaRepository<SeguimientoDespacho, Long> {
    
    Optional<SeguimientoDespacho> findByPedidoId(Long pedidoId);
    
    Optional<SeguimientoDespacho> findByNumeroGuia(String numeroGuia);
}
