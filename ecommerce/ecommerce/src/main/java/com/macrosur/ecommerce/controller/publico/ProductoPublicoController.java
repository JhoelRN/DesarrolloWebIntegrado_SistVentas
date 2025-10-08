package com.macrosur.ecommerce.controller.publico;

import com.macrosur.ecommerce.exception.ResourceNotFoundException;
import com.macrosur.ecommerce.model.entity.Producto;
import com.macrosur.ecommerce.service.IProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/publico/productos")
@CrossOrigin(origins = "http://localhost:5173") // Permitir acceso desde el frontend de React
public class ProductoPublicoController {

    @Autowired
    private IProductoService productoService;

    // GET: /api/v1/publico/productos (Listado de productos activos para la home/catálogo)
    @GetMapping
    public ResponseEntity<List<Producto>> listarActivos(
            @RequestParam(required = false) Integer categoriaId,
            @RequestParam(required = false) String nombreBusqueda) {

        if (categoriaId != null) {
            return ResponseEntity.ok(productoService.buscarPorCategoria(categoriaId));
        }
        if (nombreBusqueda != null && !nombreBusqueda.isEmpty()) {
            return ResponseEntity.ok(productoService.buscarPorNombre(nombreBusqueda));
        }

        return ResponseEntity.ok(productoService.obtenerActivos());
    }

    // GET: /api/v1/publico/productos/{id} (Detalle de producto)
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerPorId(@PathVariable Long id) {
        Producto producto = productoService.obtenerActivoPorId(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto activo no encontrado con ID: " + id));

        return ResponseEntity.ok(producto);
    }
}
