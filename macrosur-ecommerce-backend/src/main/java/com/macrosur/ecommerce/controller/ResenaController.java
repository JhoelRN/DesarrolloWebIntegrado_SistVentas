package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.CreateResenaDTO;
import com.macrosur.ecommerce.dto.ResenaDTO;
import com.macrosur.ecommerce.service.ResenaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controller REST para gestión de reseñas de productos
 */
@RestController
@RequestMapping("/api/resenas")
public class ResenaController {

    @Autowired
    private ResenaService resenaService;

    /**
     * Crear nueva reseña (requiere autenticación de cliente)
     * POST /api/resenas
     */
    @PostMapping
    public ResponseEntity<?> crearResena(
            @Valid @RequestBody CreateResenaDTO dto,
            @RequestHeader(value = "X-Cliente-Id", required = false) Long clienteId) {
        
        try {
            if (clienteId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Debes iniciar sesión para reseñar"));
            }

            ResenaDTO resena = resenaService.crearResena(dto, clienteId);
            return ResponseEntity.status(HttpStatus.CREATED).body(resena);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Listar reseñas aprobadas de un producto (público)
     * GET /api/resenas/producto/{productoId}
     */
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<Map<String, Object>> listarResenasProducto(
            @PathVariable Integer productoId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Map<String, Object> response = resenaService.listarResenasProducto(productoId, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Listar reseñas del cliente autenticado
     * GET /api/resenas/mis-resenas
     */
    @GetMapping("/mis-resenas")
    public ResponseEntity<?> listarMisResenas(
            @RequestHeader(value = "X-Cliente-Id", required = false) Long clienteId) {
        
        if (clienteId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Debes iniciar sesión"));
        }

        List<ResenaDTO> resenas = resenaService.listarResenasCliente(clienteId);
        return ResponseEntity.ok(resenas);
    }

    /**
     * Verificar si el cliente puede reseñar un producto
     * GET /api/resenas/puede-resenar/{productoId}
     */
    @GetMapping("/puede-resenar/{productoId}")
    public ResponseEntity<?> puedeResenar(
            @PathVariable Integer productoId,
            @RequestHeader(value = "X-Cliente-Id", required = false) Long clienteId) {
        
        if (clienteId == null) {
            return ResponseEntity.ok(Map.of("puedeResenar", false, "motivo", "No autenticado"));
        }

        boolean puede = resenaService.puedeResenar(clienteId, productoId);
        return ResponseEntity.ok(Map.of(
            "puedeResenar", puede,
            "motivo", puede ? "Puede reseñar" : "Ya has reseñado este producto"
        ));
    }

    /**
     * Aprobar reseña (admin)
     * PATCH /api/resenas/{id}/aprobar
     */
    @PatchMapping("/{id}/aprobar")
    public ResponseEntity<?> aprobarResena(@PathVariable Long id) {
        try {
            ResenaDTO resena = resenaService.aprobarResena(id);
            return ResponseEntity.ok(resena);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Rechazar reseña (admin)
     * PATCH /api/resenas/{id}/rechazar
     */
    @PatchMapping("/{id}/rechazar")
    public ResponseEntity<?> rechazarResena(@PathVariable Long id) {
        try {
            ResenaDTO resena = resenaService.rechazarResena(id);
            return ResponseEntity.ok(resena);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Listar reseñas por estado (admin)
     * GET /api/resenas/pendientes?estado=Pendiente&page=0&size=10
     */
    @GetMapping("/pendientes")
    public ResponseEntity<Map<String, Object>> listarPendientes(
            @RequestParam(defaultValue = "Pendiente") String estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Map<String, Object> response = resenaService.listarResenasPorEstado(estado, pageable);
        return ResponseEntity.ok(response);
    }

    /**
     * Listar reseñas de un cliente específico (admin)
     * GET /api/resenas/cliente/{clienteId}
     */
    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<?> listarResenasPorCliente(
            @PathVariable Long clienteId,
            @RequestHeader(value = "X-Is-Admin", required = false, defaultValue = "false") Boolean isAdmin) {
        
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acceso denegado"));
        }

        List<ResenaDTO> resenas = resenaService.listarResenasCliente(clienteId);
        return ResponseEntity.ok(resenas);
    }

    /**
     * Eliminar reseña (cliente dueño o admin)
     * DELETE /api/resenas/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarResena(
            @PathVariable Long id,
            @RequestHeader(value = "X-Cliente-Id", required = false) Long clienteId,
            @RequestHeader(value = "X-Is-Admin", required = false, defaultValue = "false") Boolean isAdmin) {
        
        try {
            resenaService.eliminarResena(id, clienteId, isAdmin);
            return ResponseEntity.ok(Map.of("message", "Reseña eliminada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
