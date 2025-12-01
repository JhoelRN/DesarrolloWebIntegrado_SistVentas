package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.ProveedorDTO;
import com.macrosur.ecommerce.entity.Proveedor;
import com.macrosur.ecommerce.repository.ProveedorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/logistica/proveedores")
@RequiredArgsConstructor
public class ProveedorController {
    
    private final ProveedorRepository proveedorRepository;
    
    /**
     * GET /api/logistica/proveedores - Obtener todos los proveedores
     */
    @GetMapping
    public ResponseEntity<List<ProveedorDTO>> obtenerProveedores() {
        List<ProveedorDTO> proveedores = proveedorRepository.findAll().stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(proveedores);
    }
    
    /**
     * GET /api/logistica/proveedores/{proveedorId} - Obtener proveedor por ID
     */
    @GetMapping("/{proveedorId}")
    public ResponseEntity<ProveedorDTO> obtenerProveedorPorId(@PathVariable Integer proveedorId) {
        Proveedor proveedor = proveedorRepository.findById(proveedorId)
            .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        return ResponseEntity.ok(convertirADTO(proveedor));
    }
    
    /**
     * POST /api/logistica/proveedores - Crear proveedor
     */
    @PostMapping
    public ResponseEntity<ProveedorDTO> crearProveedor(@RequestBody ProveedorDTO dto) {
        Proveedor proveedor = new Proveedor();
        proveedor.setNombre(dto.getNombre());
        proveedor.setContacto(dto.getContacto());
        proveedor.setTelefono(dto.getTelefono());
        
        proveedor = proveedorRepository.save(proveedor);
        return ResponseEntity.ok(convertirADTO(proveedor));
    }
    
    /**
     * PUT /api/logistica/proveedores/{proveedorId} - Actualizar proveedor
     */
    @PutMapping("/{proveedorId}")
    public ResponseEntity<ProveedorDTO> actualizarProveedor(
        @PathVariable Integer proveedorId,
        @RequestBody ProveedorDTO dto
    ) {
        Proveedor proveedor = proveedorRepository.findById(proveedorId)
            .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        
        proveedor.setNombre(dto.getNombre());
        proveedor.setContacto(dto.getContacto());
        proveedor.setTelefono(dto.getTelefono());
        
        proveedor = proveedorRepository.save(proveedor);
        return ResponseEntity.ok(convertirADTO(proveedor));
    }
    
    /**
     * DELETE /api/logistica/proveedores/{proveedorId} - Eliminar proveedor
     */
    @DeleteMapping("/{proveedorId}")
    public ResponseEntity<Void> eliminarProveedor(@PathVariable Integer proveedorId) {
        proveedorRepository.deleteById(proveedorId);
        return ResponseEntity.noContent().build();
    }
    
    private ProveedorDTO convertirADTO(Proveedor proveedor) {
        ProveedorDTO dto = new ProveedorDTO();
        dto.setProveedorId(proveedor.getProveedorId());
        dto.setNombre(proveedor.getNombre());
        dto.setContacto(proveedor.getContacto());
        dto.setTelefono(proveedor.getTelefono());
        return dto;
    }
}
