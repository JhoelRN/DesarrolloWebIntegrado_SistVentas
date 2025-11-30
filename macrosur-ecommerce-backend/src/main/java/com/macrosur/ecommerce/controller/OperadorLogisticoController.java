package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.OperadorLogisticoDTO;
import com.macrosur.ecommerce.entity.OperadorLogistico;
import com.macrosur.ecommerce.repository.OperadorLogisticoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/logistica/operadores")
@RequiredArgsConstructor
public class OperadorLogisticoController {
    
    private final OperadorLogisticoRepository operadorRepository;
    
    /**
     * GET /api/logistica/operadores - Obtener todos los operadores
     */
    @GetMapping
    public ResponseEntity<List<OperadorLogisticoDTO>> obtenerOperadores() {
        List<OperadorLogisticoDTO> operadores = operadorRepository.findAll().stream()
            .map(this::convertirADTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(operadores);
    }
    
    /**
     * GET /api/logistica/operadores/{operadorId} - Obtener operador por ID
     */
    @GetMapping("/{operadorId}")
    public ResponseEntity<OperadorLogisticoDTO> obtenerOperadorPorId(@PathVariable Integer operadorId) {
        OperadorLogistico operador = operadorRepository.findById(operadorId)
            .orElseThrow(() -> new RuntimeException("Operador no encontrado"));
        return ResponseEntity.ok(convertirADTO(operador));
    }
    
    /**
     * POST /api/logistica/operadores - Crear operador
     */
    @PostMapping
    public ResponseEntity<OperadorLogisticoDTO> crearOperador(@RequestBody OperadorLogisticoDTO dto) {
        OperadorLogistico operador = new OperadorLogistico();
        operador.setNombre(dto.getNombre());
        operador.setUrlRastreoBase(dto.getUrlRastreoBase());
        
        operador = operadorRepository.save(operador);
        return ResponseEntity.ok(convertirADTO(operador));
    }
    
    /**
     * PUT /api/logistica/operadores/{operadorId} - Actualizar operador
     */
    @PutMapping("/{operadorId}")
    public ResponseEntity<OperadorLogisticoDTO> actualizarOperador(
        @PathVariable Integer operadorId,
        @RequestBody OperadorLogisticoDTO dto
    ) {
        OperadorLogistico operador = operadorRepository.findById(operadorId)
            .orElseThrow(() -> new RuntimeException("Operador no encontrado"));
        
        operador.setNombre(dto.getNombre());
        operador.setUrlRastreoBase(dto.getUrlRastreoBase());
        
        operador = operadorRepository.save(operador);
        return ResponseEntity.ok(convertirADTO(operador));
    }
    
    /**
     * DELETE /api/logistica/operadores/{operadorId} - Eliminar operador
     */
    @DeleteMapping("/{operadorId}")
    public ResponseEntity<Void> eliminarOperador(@PathVariable Integer operadorId) {
        operadorRepository.deleteById(operadorId);
        return ResponseEntity.noContent().build();
    }
    
    private OperadorLogisticoDTO convertirADTO(OperadorLogistico operador) {
        OperadorLogisticoDTO dto = new OperadorLogisticoDTO();
        dto.setOperadorId(operador.getOperadorId());
        dto.setNombre(operador.getNombre());
        dto.setUrlRastreoBase(operador.getUrlRastreoBase());
        return dto;
    }
}
