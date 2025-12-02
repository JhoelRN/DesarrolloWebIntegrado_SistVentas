package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.dto.ClienteDTO;
import com.macrosur.ecommerce.entity.Cliente;
import com.macrosur.ecommerce.repository.ClienteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Servicio para gestionar clientes y autenticación
 */
@Service
@Transactional
public class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Registrar nuevo cliente (manual)
     */
    public ClienteDTO registrarCliente(String nombre, String apellido, String correo, String contrasena, String telefono) {
        // Validar que el correo no exista
        if (clienteRepository.existsByCorreo(correo)) {
            throw new RuntimeException("El correo ya está registrado");
        }

        Cliente cliente = new Cliente();
        cliente.setNombre(nombre);
        cliente.setApellido(apellido);
        cliente.setCorreo(correo);
        cliente.setContrasenaHash(passwordEncoder.encode(contrasena));
        cliente.setTelefono(telefono);

        Cliente saved = clienteRepository.save(cliente);
        return convertirADTO(saved);
    }

    /**
     * Login manual (correo y contraseña)
     */
    public Map<String, Object> loginManual(String correo, String contrasena) {
        Cliente cliente = clienteRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Credenciales inválidas"));

        if (cliente.isOAuthUser()) {
            throw new RuntimeException("Esta cuenta usa login social. Usa Google o Microsoft.");
        }

        if (!passwordEncoder.matches(contrasena, cliente.getContrasenaHash())) {
            throw new RuntimeException("Credenciales inválidas");
        }

        return generarRespuestaLogin(cliente);
    }

    /**
     * Login o registro con OAuth (Google/Microsoft)
     */
    public Map<String, Object> loginOAuth(String provider, String oauthId, String nombre, String apellido, String correo, String avatarUrl) {
        Optional<Cliente> existente = clienteRepository.findByOAuthProviderAndOAuthId(provider, oauthId);

        Cliente cliente;
        if (existente.isPresent()) {
            // Usuario existente
            cliente = existente.get();
            
            // Actualizar avatar si cambió
            if (avatarUrl != null && !avatarUrl.equals(cliente.getAvatarUrl())) {
                cliente.setAvatarUrl(avatarUrl);
                cliente = clienteRepository.save(cliente);
            }
        } else {
            // Verificar si el correo ya existe (login manual previo)
            Optional<Cliente> porCorreo = clienteRepository.findByCorreo(correo);
            if (porCorreo.isPresent() && !porCorreo.get().isOAuthUser()) {
                throw new RuntimeException("Este correo ya está registrado con contraseña. Usa login manual.");
            }

            // Nuevo usuario OAuth
            cliente = new Cliente();
            cliente.setNombre(nombre);
            cliente.setApellido(apellido);
            cliente.setCorreo(correo);
            cliente.setOauthProvider(provider);
            cliente.setOauthId(oauthId);
            cliente.setAvatarUrl(avatarUrl);
            cliente = clienteRepository.save(cliente);
        }

        return generarRespuestaLogin(cliente);
    }

    /**
     * Obtener cliente por ID
     */
    public ClienteDTO obtenerCliente(Long clienteId) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return convertirADTO(cliente);
    }

    /**
     * Actualizar perfil de cliente
     */
    public ClienteDTO actualizarPerfil(Long clienteId, String nombre, String apellido, String telefono) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        if (nombre != null && !nombre.isEmpty()) {
            cliente.setNombre(nombre);
        }
        if (apellido != null && !apellido.isEmpty()) {
            cliente.setApellido(apellido);
        }
        if (telefono != null) {
            cliente.setTelefono(telefono);
        }

        Cliente saved = clienteRepository.save(cliente);
        return convertirADTO(saved);
    }

    /**
     * Cambiar contraseña (solo para usuarios manuales)
     */
    public void cambiarContrasena(Long clienteId, String contrasenaActual, String contrasenaNueva) {
        Cliente cliente = clienteRepository.findById(clienteId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        if (cliente.isOAuthUser()) {
            throw new RuntimeException("Las cuentas OAuth no tienen contraseña");
        }

        if (!passwordEncoder.matches(contrasenaActual, cliente.getContrasenaHash())) {
            throw new RuntimeException("Contraseña actual incorrecta");
        }

        cliente.setContrasenaHash(passwordEncoder.encode(contrasenaNueva));
        clienteRepository.save(cliente);
    }

    // Métodos auxiliares
    private Map<String, Object> generarRespuestaLogin(Cliente cliente) {
        Map<String, Object> response = new HashMap<>();
        response.put("clienteId", cliente.getClienteId());
        response.put("nombre", cliente.getNombre());
        response.put("apellido", cliente.getApellido());
        response.put("correo", cliente.getCorreo());
        response.put("avatarUrl", cliente.getAvatarUrl());
        response.put("oauthProvider", cliente.getOauthProvider());
        response.put("isOAuthUser", cliente.isOAuthUser());
        
        // TODO: Generar JWT token aquí
        // String token = jwtUtil.generateToken(cliente);
        // response.put("token", token);
        
        return response;
    }

    /**
     * Listar todos los clientes (admin)
     */
    public java.util.List<ClienteDTO> listarTodosLosClientes() {
        return clienteRepository.findAll().stream()
                .map(this::convertirADTO)
                .collect(java.util.stream.Collectors.toList());
    }

    private ClienteDTO convertirADTO(Cliente cliente) {
        ClienteDTO dto = new ClienteDTO();
        dto.setClienteId(cliente.getClienteId());
        dto.setNombre(cliente.getNombre());
        dto.setApellido(cliente.getApellido());
        dto.setCorreo(cliente.getCorreo());
        dto.setTelefono(cliente.getTelefono());
        dto.setFechaRegistro(cliente.getFechaRegistro());
        dto.setOauthProvider(cliente.getOauthProvider());
        dto.setOauthId(cliente.getOauthId());
        dto.setAvatarUrl(cliente.getAvatarUrl());
        return dto;
    }
}
