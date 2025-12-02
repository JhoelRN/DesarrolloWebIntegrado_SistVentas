package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.CrearPedidoDTO;
import com.macrosur.ecommerce.dto.PedidoResponseDTO;
import com.macrosur.ecommerce.service.PedidoService;
import lombok.RequiredArgsConstructor;

import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {
    
    private static final Logger logger = LoggerFactory.getLogger(PedidoController.class);
    private final PedidoService pedidoService;
    
    /**
     * POST /api/pedidos - Crear pedido desde carrito
     */
    @PostMapping
    public ResponseEntity<?> crearPedido(@RequestBody CrearPedidoDTO crearDTO) {
        try {
            logger.info("📥 Recibiendo petición de creación de pedido: clienteId={}, items={}", 
                crearDTO.getClienteId(), crearDTO.getItems() != null ? crearDTO.getItems().size() : 0);
            PedidoResponseDTO pedido = pedidoService.crearPedido(crearDTO);
            return ResponseEntity.ok(pedido);
        } catch (RuntimeException e) {
            logger.error("❌ Error al crear pedido: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().body(java.util.Map.of("error", e.getMessage()));
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
    
    /**
     * POST /api/pedidos/{pedidoId}/seguimiento - Asignar seguimiento a pedido
     */
    @PostMapping("/{pedidoId}/seguimiento")
    public ResponseEntity<?> asignarSeguimiento(
        @PathVariable Long pedidoId,
        @RequestBody Map<String, String> request
    ) {
        try {
            String numeroGuia = request.get("numeroGuia");
            String operadorLogistico = request.get("operadorLogistico");
            
            if (numeroGuia == null || numeroGuia.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Número de guía requerido"));
            }
            if (operadorLogistico == null || operadorLogistico.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Operador logístico requerido"));
            }
            
            Map<String, Object> resultado = pedidoService.asignarSeguimiento(pedidoId, numeroGuia, operadorLogistico);
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            logger.error("❌ Error al asignar seguimiento: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
