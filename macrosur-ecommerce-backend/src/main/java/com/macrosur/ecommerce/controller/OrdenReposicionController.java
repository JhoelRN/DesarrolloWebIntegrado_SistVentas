package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.CrearOrdenReposicionDTO;
import com.macrosur.ecommerce.dto.OrdenReposicionDTO;
import com.macrosur.ecommerce.dto.RecepcionOrdenDTO;
import com.macrosur.ecommerce.service.OrdenPdfService;
import com.macrosur.ecommerce.service.OrdenReposicionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/logistica/ordenes-reposicion")
@RequiredArgsConstructor
public class OrdenReposicionController {
    
    private final OrdenReposicionService ordenReposicionService;
    private final OrdenPdfService ordenPdfService;
    
    /**
     * POST /api/logistica/ordenes - Crear nueva orden de reposición
     */
    @PostMapping
    public ResponseEntity<OrdenReposicionDTO> crearOrden(@RequestBody CrearOrdenReposicionDTO crearDTO) {
        OrdenReposicionDTO orden = ordenReposicionService.crearOrdenReposicion(crearDTO);
        return ResponseEntity.ok(orden);
    }
    
    /**
     * GET /api/logistica/ordenes - Obtener todas las órdenes
     */
    @GetMapping
    public ResponseEntity<List<OrdenReposicionDTO>> obtenerTodasLasOrdenes() {
        List<OrdenReposicionDTO> ordenes = ordenReposicionService.obtenerTodasLasOrdenes();
        return ResponseEntity.ok(ordenes);
    }
    
    /**
     * GET /api/logistica/ordenes/estado/{estado} - Obtener órdenes por estado
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<OrdenReposicionDTO>> obtenerOrdenesPorEstado(@PathVariable String estado) {
        List<OrdenReposicionDTO> ordenes = ordenReposicionService.obtenerOrdenesPorEstado(estado);
        return ResponseEntity.ok(ordenes);
    }
    
    /**
     * PATCH /api/logistica/ordenes/{ordenId}/autorizar - Autorizar orden
     */
    @PatchMapping("/{ordenId}/autorizar")
    public ResponseEntity<OrdenReposicionDTO> autorizarOrden(
        @PathVariable Integer ordenId,
        @RequestParam Integer usuarioAdminId
    ) {
        OrdenReposicionDTO orden = ordenReposicionService.autorizarOrden(ordenId, usuarioAdminId);
        return ResponseEntity.ok(orden);
    }
    
    /**
     * PATCH /api/logistica/ordenes/{ordenId}/rechazar - Rechazar orden
     */
    @PatchMapping("/{ordenId}/rechazar")
    public ResponseEntity<OrdenReposicionDTO> rechazarOrden(@PathVariable Integer ordenId) {
        OrdenReposicionDTO orden = ordenReposicionService.rechazarOrden(ordenId);
        return ResponseEntity.ok(orden);
    }
    
    /**
     * POST /api/logistica/ordenes/recibir - Recibir mercancía
     */
    @PostMapping("/recibir")
    public ResponseEntity<OrdenReposicionDTO> recibirMercancia(@RequestBody RecepcionOrdenDTO recepcionDTO) {
        OrdenReposicionDTO orden = ordenReposicionService.recibirMercancia(recepcionDTO);
        return ResponseEntity.ok(orden);
    }
    
    /**
     * GET /api/logistica/ordenes/{ordenId}/pdf - Descargar PDF de orden
     */
    @GetMapping("/{ordenId}/pdf")
    public ResponseEntity<byte[]> descargarPdfOrden(@PathVariable Integer ordenId) {
        byte[] pdfBytes = ordenPdfService.generarPdfOrden(ordenId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "orden_" + ordenId + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        
        return ResponseEntity.ok()
            .headers(headers)
            .body(pdfBytes);
    }
}
