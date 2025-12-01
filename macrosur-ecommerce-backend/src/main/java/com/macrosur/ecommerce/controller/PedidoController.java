package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.CrearPedidoDTO;
import com.macrosur.ecommerce.dto.PedidoResponseDTO;
import com.macrosur.ecommerce.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {
    
    private final PedidoService pedidoService;
    
    /**
     * POST /api/pedidos - Crear pedido desde carrito
     */
    @PostMapping
    public ResponseEntity<PedidoResponseDTO> crearPedido(@RequestBody CrearPedidoDTO crearDTO) {
        try {
            PedidoResponseDTO pedido = pedidoService.crearPedido(crearDTO);
            return ResponseEntity.ok(pedido);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
    
    /**
     * GET /api/pedidos - Obtener todos los pedidos (Admin)
     */
    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> obtenerTodosLosPedidos() {
        List<PedidoResponseDTO> pedidos = pedidoService.obtenerTodosLosPedidos();
        return ResponseEntity.ok(pedidos);
    }
    
    /**
     * GET /api/pedidos/mis-pedidos/{clienteId} - Obtener pedidos de un cliente
     */
    @GetMapping("/mis-pedidos/{clienteId}")
    public ResponseEntity<List<PedidoResponseDTO>> obtenerMisPedidos(@PathVariable Long clienteId) {
        List<PedidoResponseDTO> pedidos = pedidoService.obtenerPedidosPorCliente(clienteId);
        return ResponseEntity.ok(pedidos);
    }
    
    /**
     * GET /api/pedidos/{pedidoId} - Obtener pedido por ID
     */
    @GetMapping("/{pedidoId}")
    public ResponseEntity<PedidoResponseDTO> obtenerPedido(@PathVariable Long pedidoId) {
        try {
            PedidoResponseDTO pedido = pedidoService.obtenerPedidoPorId(pedidoId);
            return ResponseEntity.ok(pedido);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    /**
     * PUT /api/pedidos/{pedidoId}/estado - Actualizar estado de pedido
     */
    @PutMapping("/{pedidoId}/estado")
    public ResponseEntity<PedidoResponseDTO> actualizarEstado(
        @PathVariable Long pedidoId,
        @RequestParam String estado
    ) {
        try {
            PedidoResponseDTO pedido = pedidoService.actualizarEstadoPedido(pedidoId, estado);
            return ResponseEntity.ok(pedido);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
