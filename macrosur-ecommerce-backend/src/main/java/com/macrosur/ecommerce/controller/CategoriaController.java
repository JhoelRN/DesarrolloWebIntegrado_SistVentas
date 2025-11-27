package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.CategoriaDTO;
import com.macrosur.ecommerce.dto.CategoriaSaveDTO;
import com.macrosur.ecommerce.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para la gestión de Categorías
 * Endpoints para CRUD completo, jerarquía y búsqueda
 */
@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    /**
     * GET /api/categorias - Listar todas las categorías activas
     * Público - no requiere autenticación
     */
    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> listarActivas() {
        List<CategoriaDTO> categorias = categoriaService.obtenerActivas();
        return ResponseEntity.ok(categorias);
    }

    /**
     * GET /api/categorias/todas - Listar todas las categorías (incluye inactivas)
     * Requiere permiso: GESTIONAR_CATEGORIAS
     */
    @GetMapping("/todas")
    @PreAuthorize("hasAuthority('GESTIONAR_CATEGORIAS')")
    public ResponseEntity<List<CategoriaDTO>> listarTodas() {
        List<CategoriaDTO> categorias = categoriaService.obtenerTodas();
        return ResponseEntity.ok(categorias);
    }

    /**
     * GET /api/categorias/arbol - Obtener árbol jerárquico de categorías activas
     * Público - para mostrar menú de navegación
     */
    @GetMapping("/arbol")
    public ResponseEntity<List<CategoriaDTO>> obtenerArbol() {
        List<CategoriaDTO> arbol = categoriaService.obtenerArbol();
        return ResponseEntity.ok(arbol);
    }

    /**
     * GET /api/categorias/visibles - Categorías visibles para clientes
     * Público - para catálogo de productos
     */
    @GetMapping("/visibles")
    public ResponseEntity<List<CategoriaDTO>> listarVisiblesCliente() {
        List<CategoriaDTO> categorias = categoriaService.obtenerVisiblesCliente();
        return ResponseEntity.ok(categorias);
    }

    /**
     * GET /api/categorias/{id} - Obtener categoría por ID
     * Público
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            CategoriaDTO categoria = categoriaService.obtenerPorId(id);
            return ResponseEntity.ok(categoria);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/categorias - Crear nueva categoría
     * Requiere permiso: GESTIONAR_CATEGORIAS
     */
    @PostMapping
    @PreAuthorize("hasAuthority('GESTIONAR_CATEGORIAS')")
    public ResponseEntity<?> crear(@Valid @RequestBody CategoriaSaveDTO dto) {
        try {
            CategoriaDTO nueva = categoriaService.crear(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nueva);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PUT /api/categorias/{id} - Actualizar categoría existente
     * Requiere permiso: GESTIONAR_CATEGORIAS
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('GESTIONAR_CATEGORIAS')")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, 
                                       @Valid @RequestBody CategoriaSaveDTO dto) {
        try {
            CategoriaDTO actualizada = categoriaService.actualizar(id, dto);
            return ResponseEntity.ok(actualizada);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/categorias/{id}/soft - Soft delete (desactivar)
     * Requiere permiso: GESTIONAR_CATEGORIAS
     */
    @DeleteMapping("/{id}/soft")
    @PreAuthorize("hasAuthority('GESTIONAR_CATEGORIAS')")
    public ResponseEntity<?> softDelete(@PathVariable Integer id) {
        try {
            categoriaService.softDelete(id);
            return ResponseEntity.ok(Map.of("message", "Categoría desactivada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/categorias/{id}/hard - Hard delete (eliminar permanentemente)
     * Requiere permiso: GESTIONAR_CATEGORIAS
     */
    @DeleteMapping("/{id}/hard")
    @PreAuthorize("hasAuthority('GESTIONAR_CATEGORIAS')")
    public ResponseEntity<?> hardDelete(@PathVariable Integer id) {
        try {
            categoriaService.hardDelete(id);
            return ResponseEntity.ok(Map.of("message", "Categoría eliminada permanentemente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PATCH /api/categorias/{id}/reactivar - Reactivar categoría
     * Requiere permiso: GESTIONAR_CATEGORIAS
     */
    @PatchMapping("/{id}/reactivar")
    @PreAuthorize("hasAuthority('GESTIONAR_CATEGORIAS')")
    public ResponseEntity<?> reactivar(@PathVariable Integer id) {
        try {
            categoriaService.reactivar(id);
            return ResponseEntity.ok(Map.of("message", "Categoría reactivada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/categorias/buscar?q={searchTerm} - Buscar categorías por nombre
     * Público
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<CategoriaDTO>> buscar(@RequestParam("q") String searchTerm) {
        List<CategoriaDTO> categorias = categoriaService.buscarPorNombre(searchTerm);
        return ResponseEntity.ok(categorias);
    }
}
