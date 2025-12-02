package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.ProductoDTO;
import com.macrosur.ecommerce.dto.ProductoListDTO;
import com.macrosur.ecommerce.dto.ProductoSaveDTO;
import com.macrosur.ecommerce.service.FileStorageService;
import com.macrosur.ecommerce.service.ImageSearchService;
import com.macrosur.ecommerce.service.ProductoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controlador REST para la gestión de Productos
 * Endpoints para CRUD completo, filtros, paginación y búsqueda
 */
@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ImageSearchService imageSearchService;

    /**
     * GET /api/productos - Listar productos con paginación y filtros
     * Público - para catálogo de clientes
     * 
     * Parámetros opcionales:
     * - search: búsqueda por código o nombre
     * - categoria: ID de categoría
     * - precioMin: precio mínimo
     * - precioMax: precio máximo
     * - page: número de página (default: 0)
     * - size: tamaño de página (default: 20)
     * - sortBy: campo de ordenamiento (default: nombreProducto)
     * - sortDir: dirección (asc/desc, default: asc)
     */
    /**
     * GET /api/productos - Listar productos (endpoint público)
     * NO requiere autenticación - acceso público para catálogo de clientes
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> listar(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer categoria,
            @RequestParam(required = false) BigDecimal precioMin,
            @RequestParam(required = false) BigDecimal precioMax,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "nombreProducto") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        System.out.println("📦 GET /api/productos - Params: search=" + search + ", categoria=" + categoria + 
                          ", precioMin=" + precioMin + ", precioMax=" + precioMax + ", page=" + page + ", size=" + size);

        Page<ProductoListDTO> productosPage = productoService.listarConFiltros(
                search, categoria, precioMin, precioMax, page, size, sortBy, sortDir);

        System.out.println("✅ Productos encontrados: " + productosPage.getTotalElements() + " total, " + 
                          productosPage.getContent().size() + " en esta página");

        // Construir respuesta con metadata de paginación
        Map<String, Object> response = new HashMap<>();
        response.put("content", productosPage.getContent());  // Cambiar 'productos' a 'content' para consistencia
        response.put("productos", productosPage.getContent()); // Mantener 'productos' para compatibilidad
        response.put("currentPage", productosPage.getNumber());
        response.put("number", productosPage.getNumber());     // Añadir 'number' para Spring Data Page estándar
        response.put("totalElements", productosPage.getTotalElements());
        response.put("totalItems", productosPage.getTotalElements()); // Alias
        response.put("totalPages", productosPage.getTotalPages());
        response.put("pageSize", productosPage.getSize());
        response.put("size", productosPage.getSize());
        response.put("hasNext", productosPage.hasNext());
        response.put("hasPrevious", productosPage.hasPrevious());

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/productos/{id} - Obtener producto por ID (información completa)
     * Público
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Integer id) {
        try {
            ProductoDTO producto = productoService.obtenerPorId(id);
            return ResponseEntity.ok(producto);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/productos/{id}/relacionados - Obtener productos relacionados
     * Público
     */
    @GetMapping("/{id}/relacionados")
    public ResponseEntity<List<ProductoListDTO>> obtenerRelacionados(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "6") int limit) {
        List<ProductoListDTO> relacionados = productoService.obtenerRelacionados(id, limit);
        return ResponseEntity.ok(relacionados);
    }

    /**
     * GET /api/productos/{id}/variantes - Obtener variantes de un producto
     * Público - para selector de variantes en detalle de producto
     */
    @GetMapping("/{id}/variantes")
    public ResponseEntity<?> obtenerVariantesPorProducto(@PathVariable Integer id) {
        try {
            List<Map<String, Object>> variantes = productoService.obtenerVariantesPorProducto(id);
            return ResponseEntity.ok(variantes);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/productos - Crear nuevo producto
     * Requiere permiso: GESTIONAR_PRODUCTOS
     */
    @PostMapping
    @PreAuthorize("hasAuthority('GESTIONAR_PRODUCTOS')")
    public ResponseEntity<?> crear(@Valid @RequestBody ProductoSaveDTO dto) {
        try {
            ProductoDTO nuevo = productoService.crear(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PUT /api/productos/{id} - Actualizar producto existente
     * Requiere permiso: GESTIONAR_PRODUCTOS
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('GESTIONAR_PRODUCTOS')")
    public ResponseEntity<?> actualizar(@PathVariable Integer id, 
                                       @Valid @RequestBody ProductoSaveDTO dto) {
        try {
            ProductoDTO actualizado = productoService.actualizar(id, dto);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/productos/{id}/soft - Soft delete (desactivar)
     * Requiere permiso: GESTIONAR_PRODUCTOS
     */
    @DeleteMapping("/{id}/soft")
    @PreAuthorize("hasAuthority('GESTIONAR_PRODUCTOS')")
    public ResponseEntity<?> softDelete(@PathVariable Integer id) {
        try {
            productoService.softDelete(id);
            return ResponseEntity.ok(Map.of("message", "Producto desactivado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/productos/{id}/hard - Hard delete (eliminar permanentemente)
     * Requiere permiso: GESTIONAR_PRODUCTOS
     */
    @DeleteMapping("/{id}/hard")
    @PreAuthorize("hasAuthority('GESTIONAR_PRODUCTOS')")
    public ResponseEntity<?> hardDelete(@PathVariable Integer id) {
        try {
            productoService.hardDelete(id);
            return ResponseEntity.ok(Map.of("message", "Producto eliminado permanentemente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PATCH /api/productos/{id}/reactivar - Reactivar producto
     * Requiere permiso: GESTIONAR_PRODUCTOS
     */
    @PatchMapping("/{id}/reactivar")
    @PreAuthorize("hasAuthority('GESTIONAR_PRODUCTOS')")
    public ResponseEntity<?> reactivar(@PathVariable Integer id) {
        try {
            productoService.reactivar(id);
            return ResponseEntity.ok(Map.of("message", "Producto reactivado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PATCH /api/productos/{id}/estado - Cambiar estado activo/inactivo
     * Requiere permiso: GESTIONAR_PRODUCTOS
     */
    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAuthority('GESTIONAR_PRODUCTOS')")
    public ResponseEntity<?> cambiarEstado(@PathVariable Integer id, 
                                           @RequestBody Map<String, Boolean> body) {
        try {
            Boolean activo = body.get("activo");
            if (activo == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("error", "El campo 'activo' es requerido"));
            }
            productoService.cambiarEstado(id, activo);
            return ResponseEntity.ok(Map.of("message", "Estado actualizado exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/productos/upload-imagen - Subir imagen de producto
     * Requiere permiso: GESTIONAR_PRODUCTOS
     * 
     * @param file Archivo de imagen (jpg, jpeg, png, webp, gif)
     * @param codigoProducto Código del producto (opcional, se puede usar para nombrar archivo)
     * @return Ruta relativa de la imagen guardada
     */
    @PostMapping("/upload-imagen")
    @PreAuthorize("hasAuthority('GESTIONAR_PRODUCTOS')")
    public ResponseEntity<?> uploadImagen(
            @RequestParam("file") MultipartFile file,
            @RequestParam(required = false, defaultValue = "PROD") String codigoProducto) {
        try {
            String filePath = fileStorageService.storeFile(file, codigoProducto);
            return ResponseEntity.ok(Map.of(
                "message", "Imagen subida exitosamente",
                "filePath", filePath,
                "fileName", file.getOriginalFilename(),
                "fileSize", file.getSize()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al subir la imagen: " + e.getMessage()));
        }
    }

    /**
     * GET /api/productos/buscar-imagenes - Buscar imágenes en biblioteca online
     * Requiere permiso: GESTIONAR_PRODUCTOS
     * 
     * @param query Término de búsqueda (ej: "alfombras persas", "cojines decorativos")
     * @param perPage Número de resultados (default: 12)
     * @return Lista de URLs de imágenes con metadatos
     */
    @GetMapping("/buscar-imagenes")
    @PreAuthorize("hasAuthority('GESTIONAR_PRODUCTOS')")
    public ResponseEntity<List<ImageSearchService.ImageResult>> buscarImagenes(
            @RequestParam String query,
            @RequestParam(required = false) Integer perPage) {
        try {
            List<ImageSearchService.ImageResult> images = imageSearchService.searchImages(query, perPage);
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(List.of());
        }
    }

    /**
     * GET /api/productos/estadisticas - Obtener estadísticas de productos
     * Requiere permiso: GESTIONAR_PRODUCTOS
     */
    @GetMapping("/estadisticas")
    @PreAuthorize("hasAuthority('GESTIONAR_PRODUCTOS')")
    public ResponseEntity<ProductoService.ProductoStats> obtenerEstadisticas() {
        ProductoService.ProductoStats stats = productoService.obtenerEstadisticas();
        return ResponseEntity.ok(stats);
    }

    /**
     * GET /api/productos/variantes - Obtener todas las variantes de productos
     * Endpoint público para selección en órdenes de reposición
     */
    @GetMapping("/variantes")
    public ResponseEntity<?> obtenerTodasLasVariantes() {
        try {
            List<?> variantes = productoService.obtenerTodasLasVariantes();
            return ResponseEntity.ok(variantes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener variantes: " + e.getMessage()));
        }
    }

    /**
     * GET /api/productos/variantes/reposicion - Obtener variantes que necesitan reposición
     * Incluye: variantes con stock bajo y variantes sin inventario (productos nuevos)
     * Endpoint para dropdown en órdenes de reposición
     */
    @GetMapping("/variantes/reposicion")
    public ResponseEntity<?> obtenerVariantesParaReposicion() {
        try {
            List<?> variantes = productoService.obtenerVariantesParaReposicion();
            return ResponseEntity.ok(variantes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error al obtener variantes para reposición: " + e.getMessage()));
        }
    }
}
