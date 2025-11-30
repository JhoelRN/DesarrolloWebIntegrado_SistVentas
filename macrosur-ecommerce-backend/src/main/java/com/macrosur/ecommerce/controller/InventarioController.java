package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.AjusteInventarioDTO;
import com.macrosur.ecommerce.dto.InventarioDTO;
import com.macrosur.ecommerce.dto.TransferenciaStockDTO;
import com.macrosur.ecommerce.service.InventarioService;
import com.macrosur.ecommerce.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/logistica/inventario")
@RequiredArgsConstructor
public class InventarioController {
    
    private final InventarioService inventarioService;
    private final ProductoService productoService;
    
    /**
     * GET /api/logistica/inventario - Obtener todo el inventario
     */
    @GetMapping
    public ResponseEntity<List<InventarioDTO>> obtenerInventarioCompleto() {
        List<InventarioDTO> inventarios = inventarioService.obtenerInventarioCompleto();
        return ResponseEntity.ok(inventarios);
    }
    
    /**
     * GET /api/logistica/inventario/ubicacion/{ubicacionId} - Inventario por ubicación
     */
    @GetMapping("/ubicacion/{ubicacionId}")
    public ResponseEntity<List<InventarioDTO>> obtenerInventarioPorUbicacion(@PathVariable Integer ubicacionId) {
        List<InventarioDTO> inventarios = inventarioService.obtenerInventarioPorUbicacion(ubicacionId);
        return ResponseEntity.ok(inventarios);
    }
    
    /**
     * GET /api/inventario/variante/{varianteId} - Inventario por variante (todas las ubicaciones)
     */
    @GetMapping("/variante/{varianteId}")
    public ResponseEntity<List<InventarioDTO>> obtenerInventarioPorVariante(@PathVariable Integer varianteId) {
        List<InventarioDTO> inventarios = inventarioService.obtenerInventarioPorVariante(varianteId);
        return ResponseEntity.ok(inventarios);
    }
    
    /**
     * POST /api/logistica/inventario/ajustar - Ajustar inventario manualmente
     */
    @PostMapping("/ajustar")
    public ResponseEntity<InventarioDTO> ajustarInventario(@RequestBody AjusteInventarioDTO ajusteDTO) {
        InventarioDTO resultado = inventarioService.ajustarInventario(ajusteDTO);
        return ResponseEntity.ok(resultado);
    }
    
    /**
     * POST /api/logistica/inventario/transferir - Transferir stock entre ubicaciones
     */
    @PostMapping("/transferir")
    public ResponseEntity<Void> transferirStock(@RequestBody TransferenciaStockDTO transferenciaDTO) {
        inventarioService.transferirStock(transferenciaDTO);
        return ResponseEntity.ok().build();
    }
    
    /**
     * POST /api/logistica/inventario/auto-crear - Crear inventario automático para variantes sin inventario
     * ENDPOINT DE UTILIDAD: Se ejecuta una vez para crear inventarios de variantes existentes
     * En producción, las nuevas variantes crearán inventario automáticamente via EntityListener
     */
    @PostMapping("/auto-crear")
    public ResponseEntity<Map<String, Object>> crearInventarioAutomatico() {
        productoService.verificarYCrearInventarioParaVariantesExistentes();
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Proceso de auto-creación de inventario completado. Ver logs del servidor para detalles.");
        
        return ResponseEntity.ok(response);
    }
}
