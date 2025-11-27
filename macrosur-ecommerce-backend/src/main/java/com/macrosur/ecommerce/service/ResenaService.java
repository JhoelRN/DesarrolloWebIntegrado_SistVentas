package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.dto.*;
import com.macrosur.ecommerce.entity.Cliente;
import com.macrosur.ecommerce.entity.Producto;
import com.macrosur.ecommerce.entity.Resena;
import com.macrosur.ecommerce.entity.Resena.EstadoResena;
import com.macrosur.ecommerce.repository.ClienteRepository;
import com.macrosur.ecommerce.repository.ProductoRepository;
import com.macrosur.ecommerce.repository.ResenaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar reseñas de productos
 */
@Service
@Transactional
public class ResenaService {

    @Autowired
    private ResenaRepository resenaRepository;

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private ProductoRepository productoRepository;

    /**
     * Crear nueva reseña (requiere autenticación de cliente)
     */
    public ResenaDTO crearResena(CreateResenaDTO dto, Long clienteId) {
        // Validar cliente
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        // Validar producto
        Producto producto = productoRepository.findById(dto.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

        // Validar que no exista reseña previa
        if (resenaRepository.existsByClienteIdAndProductoId(clienteId, dto.getProductoId())) {
            throw new RuntimeException("Ya has reseñado este producto");
        }

        // Crear reseña
        Resena resena = new Resena();
        resena.setCliente(cliente);
        resena.setProducto(producto);
        resena.setCalificacion(dto.getCalificacion());
        resena.setComentario(dto.getComentario());

        Resena saved = resenaRepository.save(resena);
        return convertirADTO(saved);
    }

    /**
     * Listar reseñas aprobadas de un producto (público)
     */
    public Map<String, Object> listarResenasProducto(Integer productoId, Pageable pageable) {
        Page<Resena> page = resenaRepository.findAprobadasByProductoId(productoId, pageable);
        
        List<ResenaListDTO> resenas = page.getContent().stream()
                .map(this::convertirAListDTO)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("resenas", resenas);
        response.put("totalPages", page.getTotalPages());
        response.put("totalElements", page.getTotalElements());
        response.put("currentPage", page.getNumber());
        
        // Agregar estadísticas
        response.put("promedioCalificacion", resenaRepository.calcularPromedioCalificacion(productoId));
        response.put("totalResenas", resenaRepository.contarResenasAprobadas(productoId));

        return response;
    }

    /**
     * Obtener reseñas de un cliente
     */
    public List<ResenaDTO> listarResenasCliente(Long clienteId) {
        List<Resena> resenas = resenaRepository.findByClienteId(clienteId);
        return resenas.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    /**
     * Aprobar reseña (admin)
     */
    public ResenaDTO aprobarResena(Long resenaId) {
        Resena resena = resenaRepository.findById(resenaId)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
        
        resena.aprobar();
        Resena saved = resenaRepository.save(resena);
        return convertirADTO(saved);
    }

    /**
     * Rechazar reseña (admin)
     */
    public ResenaDTO rechazarResena(Long resenaId) {
        Resena resena = resenaRepository.findById(resenaId)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));
        
        resena.rechazar();
        Resena saved = resenaRepository.save(resena);
        return convertirADTO(saved);
    }

    /**
     * Listar reseñas pendientes (admin)
     */
    public Map<String, Object> listarResenasPendientes(Pageable pageable) {
        return listarResenasPorEstado("Pendiente", pageable);
    }

    /**
     * Listar reseñas por estado (admin)
     */
    public Map<String, Object> listarResenasPorEstado(String estadoStr, Pageable pageable) {
        EstadoResena estado;
        try {
            estado = EstadoResena.valueOf(estadoStr);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Estado inválido: " + estadoStr);
        }

        Page<Resena> page = resenaRepository.findByEstadoResena(estado, pageable);
        
        List<ResenaDTO> resenas = page.getContent().stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());

        Map<String, Object> response = new HashMap<>();
        response.put("content", resenas);
        response.put("totalPages", page.getTotalPages());
        response.put("totalElements", page.getTotalElements());
        response.put("currentPage", page.getNumber());

        return response;
    }

    /**
     * Eliminar reseña (cliente dueño o admin)
     */
    public void eliminarResena(Long resenaId, Long clienteId, boolean isAdmin) {
        Resena resena = resenaRepository.findById(resenaId)
                .orElseThrow(() -> new RuntimeException("Reseña no encontrada"));

        if (!isAdmin && !resena.getCliente().getClienteId().equals(clienteId)) {
            throw new RuntimeException("No tienes permiso para eliminar esta reseña");
        }

        resenaRepository.delete(resena);
    }

    /**
     * Verificar si un cliente puede reseñar un producto
     */
    public boolean puedeResenar(Long clienteId, Integer productoId) {
        return !resenaRepository.existsByClienteIdAndProductoId(clienteId, productoId);
    }

    // Métodos de conversión
    private ResenaDTO convertirADTO(Resena resena) {
        ResenaDTO dto = new ResenaDTO();
        dto.setResenaId(resena.getResenaId());
        dto.setCliente(convertirClienteADTO(resena.getCliente()));
        dto.setProductoId(resena.getProducto().getProductoId());
        dto.setProductoNombre(resena.getProducto().getNombreProducto());
        dto.setCalificacion(resena.getCalificacion());
        dto.setComentario(resena.getComentario());
        dto.setFechaResena(resena.getFechaResena());
        dto.setEstadoResena(resena.getEstadoResena().name());
        dto.setFechaCompraVerificada(resena.getFechaCompraVerificada());
        return dto;
    }

    private ResenaListDTO convertirAListDTO(Resena resena) {
        ResenaListDTO dto = new ResenaListDTO();
        dto.setResenaId(resena.getResenaId());
        dto.setClienteNombre(resena.getCliente().getNombreCompleto());
        dto.setClienteAvatarUrl(resena.getCliente().getAvatarUrl());
        dto.setCalificacion(resena.getCalificacion());
        dto.setComentario(resena.getComentario());
        dto.setFechaResena(resena.getFechaResena());
        dto.setCompraVerificada(resena.getFechaCompraVerificada() != null);
        return dto;
    }

    private ClienteDTO convertirClienteADTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setClienteId(cliente.getClienteId());
        dto.setNombre(cliente.getNombre());
        dto.setApellido(cliente.getApellido());
        dto.setCorreo(cliente.getCorreo());
        dto.setAvatarUrl(cliente.getAvatarUrl());
        dto.setOauthProvider(cliente.getOauthProvider());
        return dto;
    }
}
