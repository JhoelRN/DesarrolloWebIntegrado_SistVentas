package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.InventarioDTO;
import com.macrosur.ecommerce.service.InventarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller público para consultas de stock
 * No requiere autenticación - usado por clientes en el frontend
 */
@RestController
@RequestMapping("/api/inventario/stock")
@RequiredArgsConstructor
public class StockPublicController {
    
    private final InventarioService inventarioService;
    
    /**
     * GET /api/inventario/stock/variante/{varianteId} - Obtener stock disponible de una variante
     * Endpoint público para que clientes puedan consultar disponibilidad
     */
    @GetMapping("/variante/{varianteId}")
    public ResponseEntity<Map<String, Object>> obtenerStockVariante(@PathVariable Integer varianteId) {
        List<InventarioDTO> inventarios = inventarioService.obtenerInventarioPorVariante(varianteId);
        
        // Calcular stock total
        int stockTotal = inventarios.stream()
            .mapToInt(InventarioDTO::getCantidad)
            .sum();
        
        Map<String, Object> response = new HashMap<>();
        response.put("varianteId", varianteId);
        response.put("stockTotal", stockTotal);
        response.put("disponible", stockTotal > 0);
        response.put("ubicaciones", inventarios);
        
        return ResponseEntity.ok(response);
    }
}
