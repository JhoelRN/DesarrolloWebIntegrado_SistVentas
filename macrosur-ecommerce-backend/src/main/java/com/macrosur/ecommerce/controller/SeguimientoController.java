package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.CrearSeguimientoDTO;
import com.macrosur.ecommerce.dto.SeguimientoDespachoDTO;
import com.macrosur.ecommerce.service.SeguimientoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logistica/seguimiento")
@RequiredArgsConstructor
public class SeguimientoController {
    
    private final SeguimientoService seguimientoService;
    
    /**
     * POST /api/logistica/seguimiento - Crear seguimiento de despacho
     */
    @PostMapping
    public ResponseEntity<SeguimientoDespachoDTO> crearSeguimiento(@RequestBody CrearSeguimientoDTO crearDTO) {
        SeguimientoDespachoDTO seguimiento = seguimientoService.crearSeguimiento(crearDTO);
        return ResponseEntity.ok(seguimiento);
    }
    
    /**
     * GET /api/logistica/seguimiento/pedido/{pedidoId} - Obtener seguimiento por pedido
     */
    @GetMapping("/pedido/{pedidoId}")
    public ResponseEntity<SeguimientoDespachoDTO> obtenerSeguimientoPorPedido(@PathVariable Long pedidoId) {
        SeguimientoDespachoDTO seguimiento = seguimientoService.obtenerSeguimientoPorPedido(pedidoId);
        return ResponseEntity.ok(seguimiento);
    }
    
    /**
     * GET /api/logistica/seguimiento/guia/{numeroGuia} - Obtener seguimiento por guía
     */
    @GetMapping("/guia/{numeroGuia}")
    public ResponseEntity<SeguimientoDespachoDTO> obtenerSeguimientoPorGuia(@PathVariable String numeroGuia) {
        SeguimientoDespachoDTO seguimiento = seguimientoService.obtenerSeguimientoPorGuia(numeroGuia);
        return ResponseEntity.ok(seguimiento);
    }
    
    /**
     * PUT /api/logistica/seguimiento/{seguimientoId}/estado - Actualizar estado
     */
    @PutMapping("/{seguimientoId}/estado")
    public ResponseEntity<SeguimientoDespachoDTO> actualizarEstado(
        @PathVariable Long seguimientoId,
        @RequestParam String estado
    ) {
        SeguimientoDespachoDTO seguimiento = seguimientoService.actualizarEstadoEnvio(seguimientoId, estado);
        return ResponseEntity.ok(seguimiento);
    }
    
    /**
     * GET /api/logistica/seguimiento - Obtener todos los seguimientos
     */
    @GetMapping
    public ResponseEntity<List<SeguimientoDespachoDTO>> obtenerTodos() {
        List<SeguimientoDespachoDTO> seguimientos = seguimientoService.obtenerTodosLosSeguimientos();
        return ResponseEntity.ok(seguimientos);
    }
}
