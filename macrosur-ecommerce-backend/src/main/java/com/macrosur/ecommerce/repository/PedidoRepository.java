package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    
    List<Pedido> findByClienteIdOrderByFechaPedidoDesc(Long clienteId);
    
    List<Pedido> findByEstadoOrderByFechaPedidoDesc(Pedido.EstadoPedido estado);
    
    List<Pedido> findAllByOrderByFechaPedidoDesc();
}
