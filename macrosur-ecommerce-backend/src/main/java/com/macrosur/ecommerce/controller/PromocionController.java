package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.PromocionDTO;
import com.macrosur.ecommerce.service.PromocionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para gestión de promociones
 * Patrón: MVC Controller + RESTful API
 * 
 * Expone endpoints REST para operaciones CRUD de promociones
 * Soporta Ajax requests desde frontend (GET/POST/PUT/DELETE)
 */
@RestController
@RequestMapping("/api/promociones")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174", "http://localhost:5175"})
public class PromocionController {

    private final PromocionService promocionService;

    /**
     * GET /api/promociones
     * Obtener todas las promociones
     * Ajax Method: GET
     */
    @GetMapping
    @PreAuthorize("hasAuthority('VER_PROMOCIONES') or hasAuthority('ADMIN')")
    public ResponseEntity<List<PromocionDTO>> obtenerTodas() {
        log.info("REST GET /api/promociones - Obtener todas las promociones");
        
        try {
            List<PromocionDTO> promociones = promocionService.obtenerTodasPromociones();
            return ResponseEntity.ok(promociones);
        } catch (Exception e) {
            log.error("Error al obtener promociones", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/promociones/activas
     * Obtener solo promociones activas (público)
     * Ajax Method: GET
     */
    @GetMapping("/activas")
    public ResponseEntity<List<PromocionDTO>> obtenerActivas() {
        log.info("REST GET /api/promociones/activas - Obtener promociones activas");
        
        try {
            List<PromocionDTO> promociones = promocionService.obtenerPromocionesActivas();
            return ResponseEntity.ok(promociones);
        } catch (Exception e) {
            log.error("Error al obtener promociones activas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/promociones/{id}
     * Obtener promoción por ID
     * Ajax Method: GET
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('VER_PROMOCIONES') or hasAuthority('ADMIN')")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        log.info("REST GET /api/promociones/{} - Obtener promoción", id);
        
        try {
            PromocionDTO promocion = promocionService.obtenerPromocionPorId(id);
            return ResponseEntity.ok(promocion);
        } catch (RuntimeException e) {
            log.error("Promoción no encontrada: {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al obtener promoción", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error interno del servidor"));
        }
    }

    /**
     * POST /api/promociones
     * Crear nueva promoción
     * Ajax Method: POST
     * Body: JSON PromocionDTO
     */
    @PostMapping
    @PreAuthorize("hasAuthority('CREAR_PROMOCIONES') or hasAuthority('ADMIN')")
    public ResponseEntity<?> crear(@Valid @RequestBody PromocionDTO dto) {
        log.info("REST POST /api/promociones - Crear nueva promoción: {}", dto.getNombreRegla());
        
        try {
            PromocionDTO creada = promocionService.crearPromocion(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(creada);
        } catch (IllegalArgumentException e) {
            log.error("Validación fallida al crear promoción", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al crear promoción", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al crear la promoción"));
        }
    }

    /**
     * PUT /api/promociones/{id}
     * Actualizar promoción existente
     * Ajax Method: PUT
     * Body: JSON PromocionDTO
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('CREAR_PROMOCIONES') or hasAuthority('ADMIN')")
    public ResponseEntity<?> actualizar(
        @PathVariable Integer id, 
        @Valid @RequestBody PromocionDTO dto
    ) {
        log.info("REST PUT /api/promociones/{} - Actualizar promoción", id);
        
        try {
            PromocionDTO actualizada = promocionService.actualizarPromocion(id, dto);
            return ResponseEntity.ok(actualizada);
        } catch (IllegalArgumentException e) {
            log.error("Validación fallida al actualizar promoción", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            log.error("Error al actualizar promoción {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al actualizar promoción", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al actualizar la promoción"));
        }
    }

    /**
     * DELETE /api/promociones/{id}
     * Eliminar promoción
     * Ajax Method: DELETE
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('CREAR_PROMOCIONES') or hasAuthority('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {
        log.info("REST DELETE /api/promociones/{} - Eliminar promoción", id);
        
        try {
            promocionService.eliminarPromocion(id);
            return ResponseEntity.ok(Map.of(
                "mensaje", "Promoción eliminada correctamente",
                "id", id
            ));
        } catch (RuntimeException e) {
            log.error("Error al eliminar promoción {}", id, e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al eliminar promoción", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al eliminar la promoción"));
        }
    }

    /**
     * GET /api/promociones/buscar?nombre={nombre}
     * Buscar promociones por nombre
     * Ajax Method: GET
     */
    @GetMapping("/buscar")
    @PreAuthorize("hasAuthority('VER_PROMOCIONES') or hasAuthority('ADMIN')")
    public ResponseEntity<List<PromocionDTO>> buscar(@RequestParam String nombre) {
        log.info("REST GET /api/promociones/buscar?nombre={}", nombre);
        
        try {
            List<PromocionDTO> resultados = promocionService.buscarPorNombre(nombre);
            return ResponseEntity.ok(resultados);
        } catch (Exception e) {
            log.error("Error al buscar promociones", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/promociones/tipo/{tipo}
     * Filtrar promociones por tipo
     * Ajax Method: GET
     */
    @GetMapping("/tipo/{tipo}")
    @PreAuthorize("hasAuthority('VER_PROMOCIONES') or hasAuthority('ADMIN')")
    public ResponseEntity<?> obtenerPorTipo(@PathVariable String tipo) {
        log.info("REST GET /api/promociones/tipo/{}", tipo);
        
        try {
            List<PromocionDTO> promociones = promocionService.obtenerPorTipo(tipo);
            return ResponseEntity.ok(promociones);
        } catch (IllegalArgumentException e) {
            log.error("Tipo de promoción inválido: {}", tipo, e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al obtener promociones por tipo", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/promociones/estadisticas
     * Obtener estadísticas de promociones
     * Ajax Method: GET
     */
    @GetMapping("/estadisticas")
    @PreAuthorize("hasAuthority('VER_PROMOCIONES') or hasAuthority('ADMIN')")
    public ResponseEntity<?> obtenerEstadisticas() {
        log.info("REST GET /api/promociones/estadisticas");
        
        try {
            PromocionService.EstadisticasPromociones stats = promocionService.obtenerEstadisticas();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error al obtener estadísticas", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/promociones/{id}/calcular-descuento
     * Calcular descuento para un precio dado
     * Ajax Method: POST
     * Body: { "precio": 10000.00 }
     */
    @PostMapping("/{id}/calcular-descuento")
    public ResponseEntity<?> calcularDescuento(
        @PathVariable Integer id,
        @RequestBody Map<String, BigDecimal> request
    ) {
        log.info("REST POST /api/promociones/{}/calcular-descuento", id);
        
        try {
            BigDecimal precio = request.get("precio");
            if (precio == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Se requiere el campo 'precio'"));
            }
            
            BigDecimal descuento = promocionService.calcularDescuentoAplicable(id, precio);
            
            Map<String, Object> response = new HashMap<>();
            response.put("precioOriginal", precio);
            response.put("descuento", descuento);
            response.put("precioFinal", precio.subtract(descuento));
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Error al calcular descuento", e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            log.error("Error al calcular descuento", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
