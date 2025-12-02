package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.AlarmaStockDTO;
import com.macrosur.ecommerce.service.AlarmaStockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logistica/alarmas")
@RequiredArgsConstructor
public class AlarmaStockController {
    
    private final AlarmaStockService alarmaStockService;
    
    /**
     * GET /api/logistica/alarmas/activas - Obtener alarmas activas
     */
    @GetMapping("/activas")
    public ResponseEntity<List<AlarmaStockDTO>> obtenerAlarmasActivas() {
        List<AlarmaStockDTO> alarmas = alarmaStockService.obtenerAlarmasActivas();
        return ResponseEntity.ok(alarmas);
    }
    
    /**
     * GET /api/logistica/alarmas - Obtener todas las alarmas (historial)
     */
    @GetMapping
    public ResponseEntity<List<AlarmaStockDTO>> obtenerTodasLasAlarmas() {
        List<AlarmaStockDTO> alarmas = alarmaStockService.obtenerTodasLasAlarmas();
        return ResponseEntity.ok(alarmas);
    }
    
    /**
     * PATCH /api/logistica/alarmas/{alarmaId}/resolver - Resolver alarma
     */
    @PatchMapping("/{alarmaId}/resolver")
    public ResponseEntity<AlarmaStockDTO> resolverAlarma(@PathVariable Integer alarmaId) {
        AlarmaStockDTO resultado = alarmaStockService.resolverAlarma(alarmaId);
        return ResponseEntity.ok(resultado);
    }
}
