package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.OrdenReposicion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrdenReposicionRepository extends JpaRepository<OrdenReposicion, Integer> {
    
    List<OrdenReposicion> findByEstadoAutorizacionOrderByFechaSolicitudDesc(
        OrdenReposicion.EstadoAutorizacion estado
    );
    
    List<OrdenReposicion> findAllByOrderByFechaSolicitudDesc();
}
