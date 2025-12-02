package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.dto.CrearSeguimientoDTO;
import com.macrosur.ecommerce.dto.SeguimientoDespachoDTO;
import com.macrosur.ecommerce.entity.OperadorLogistico;
import com.macrosur.ecommerce.entity.SeguimientoDespacho;
import com.macrosur.ecommerce.repository.OperadorLogisticoRepository;
import com.macrosur.ecommerce.repository.SeguimientoDespachoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeguimientoService {
    
    private final SeguimientoDespachoRepository seguimientoRepository;
    private final OperadorLogisticoRepository operadorRepository;
    
    /**
     * Crear seguimiento de despacho
     */
    @Transactional
    public SeguimientoDespachoDTO crearSeguimiento(CrearSeguimientoDTO crearDTO) {
        // Verificar que no exista seguimiento previo para el pedido
        if (seguimientoRepository.findByPedidoId(crearDTO.getPedidoId()).isPresent()) {
            throw new RuntimeException("Ya existe un seguimiento para este pedido");
        }
        
        OperadorLogistico operador = operadorRepository.findById(crearDTO.getOperadorId())
            .orElseThrow(() -> new RuntimeException("Operador logístico no encontrado"));
        
        SeguimientoDespacho seguimiento = new SeguimientoDespacho();
        seguimiento.setPedidoId(crearDTO.getPedidoId());
        seguimiento.setOperador(operador);
        seguimiento.setNumeroGuia(crearDTO.getNumeroGuia());
        seguimiento.setFechaDespacho(LocalDateTime.now());
        seguimiento.setEstadoEnvio(SeguimientoDespacho.EstadoEnvio.EN_CAMINO);
        seguimiento.setFechaEstimadaEntrega(crearDTO.getFechaEstimadaEntrega() != null ? 
            crearDTO.getFechaEstimadaEntrega().toLocalDate() : null);
        
        seguimiento = seguimientoRepository.save(seguimiento);
        
        // TODO: Enviar correo al cliente con número de guía
        
        return convertirASeguimientoDTO(seguimiento);
    }
    
    /**
     * Obtener seguimiento por pedido ID
     */
    public SeguimientoDespachoDTO obtenerSeguimientoPorPedido(Long pedidoId) {
        SeguimientoDespacho seguimiento = seguimientoRepository.findByPedidoId(pedidoId)
            .orElseThrow(() -> new RuntimeException("No se encontró seguimiento para este pedido"));
        
        return convertirASeguimientoDTO(seguimiento);
    }
    
    /**
     * Obtener seguimiento por número de guía
     */
    public SeguimientoDespachoDTO obtenerSeguimientoPorGuia(String numeroGuia) {
        SeguimientoDespacho seguimiento = seguimientoRepository.findByNumeroGuia(numeroGuia)
            .orElseThrow(() -> new RuntimeException("No se encontró seguimiento con ese número de guía"));
        
        return convertirASeguimientoDTO(seguimiento);
    }
    
    /**
     * Actualizar estado de envío
     */
    @Transactional
    public SeguimientoDespachoDTO actualizarEstadoEnvio(Long seguimientoId, String nuevoEstado) {
        SeguimientoDespacho seguimiento = seguimientoRepository.findById(seguimientoId)
            .orElseThrow(() -> new RuntimeException("Seguimiento no encontrado"));
        
        SeguimientoDespacho.EstadoEnvio estadoEnum = SeguimientoDespacho.EstadoEnvio.valueOf(nuevoEstado.toUpperCase().replace(" ", "_"));
        seguimiento.setEstadoEnvio(estadoEnum);
        
        if (estadoEnum == SeguimientoDespacho.EstadoEnvio.ENTREGADO) {
            seguimiento.setFechaEntrega(LocalDateTime.now());
        }
        
        seguimiento = seguimientoRepository.save(seguimiento);
        
        // TODO: Enviar correo al cliente notificando cambio de estado
        
        return convertirASeguimientoDTO(seguimiento);
    }
    
    /**
     * Obtener todos los seguimientos
     */
    public List<SeguimientoDespachoDTO> obtenerTodosLosSeguimientos() {
        return seguimientoRepository.findAll().stream()
            .map(this::convertirASeguimientoDTO)
            .collect(Collectors.toList());
    }
    
    /**
     * Convertir SeguimientoDespacho a DTO
     */
    private SeguimientoDespachoDTO convertirASeguimientoDTO(SeguimientoDespacho seguimiento) {
        SeguimientoDespachoDTO dto = new SeguimientoDespachoDTO();
        dto.setSeguimientoDespachoId(seguimiento.getSeguimientoDespachoId());
        dto.setPedidoId(seguimiento.getPedidoId());
        dto.setOperadorId(seguimiento.getOperador().getOperadorId());
        dto.setNombreOperador(seguimiento.getOperador().getNombre());
        dto.setUrlRastreoBase(seguimiento.getOperador().getUrlRastreoBase());
        dto.setNumeroGuia(seguimiento.getNumeroGuia());
        
        // Construir URL completa de rastreo
        String urlCompleta = seguimiento.getOperador().getUrlRastreoBase() + seguimiento.getNumeroGuia();
        dto.setUrlRastreoCompleta(urlCompleta);
        
        dto.setFechaDespacho(seguimiento.getFechaDespacho());
        dto.setEstadoEnvio(seguimiento.getEstadoEnvio().getDescripcion());
        dto.setFechaEstimadaEntrega(seguimiento.getFechaEstimadaEntrega());
        dto.setFechaEntrega(seguimiento.getFechaEntrega());
        
        return dto;
    }
}
