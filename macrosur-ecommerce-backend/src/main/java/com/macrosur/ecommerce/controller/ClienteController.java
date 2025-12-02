package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.ClienteDTO;
import com.macrosur.ecommerce.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller REST para gestión de clientes
 */
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    @Autowired
    private ClienteService clienteService;

    /**
     * Registrar nuevo cliente (manual)
     * POST /api/clientes/registro
     */
    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Map<String, String> datos) {
        try {
            ClienteDTO cliente = clienteService.registrarCliente(
                datos.get("nombre"),
                datos.get("apellido"),
                datos.get("correo"),
                datos.get("contrasena"),
                datos.get("telefono")
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(cliente);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Login manual (correo y contraseña)
     * POST /api/clientes/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            Map<String, Object> response = clienteService.loginManual(
                credentials.get("correo"),
                credentials.get("contrasena")
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Login con OAuth (Google/Microsoft)
     * POST /api/clientes/oauth-login
     */
    @PostMapping("/oauth-login")
    public ResponseEntity<?> oauthLogin(@RequestBody Map<String, String> datos) {
        try {
            Map<String, Object> response = clienteService.loginOAuth(
                datos.get("provider"),
                datos.get("oauthId"),
                datos.get("nombre"),
                datos.get("apellido"),
                datos.get("correo"),
                datos.get("avatarUrl")
            );
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Obtener perfil del cliente autenticado
     * GET /api/clientes/perfil
     */
    @GetMapping("/perfil")
    public ResponseEntity<?> obtenerPerfil(
            @RequestHeader(value = "X-Cliente-Id", required = false) Long clienteId) {
        
        if (clienteId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autenticado"));
        }

        try {
            ClienteDTO cliente = clienteService.obtenerCliente(clienteId);
            return ResponseEntity.ok(cliente);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Actualizar perfil del cliente
     * PUT /api/clientes/perfil
     */
    @PutMapping("/perfil")
    public ResponseEntity<?> actualizarPerfil(
            @RequestHeader(value = "X-Cliente-Id", required = false) Long clienteId,
            @RequestBody Map<String, String> datos) {
        
        if (clienteId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autenticado"));
        }

        try {
            ClienteDTO cliente = clienteService.actualizarPerfil(
                clienteId,
                datos.get("nombre"),
                datos.get("apellido"),
                datos.get("telefono")
            );
            return ResponseEntity.ok(cliente);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Cambiar contraseña
     * POST /api/clientes/cambiar-contrasena
     */
    @PostMapping("/cambiar-contrasena")
    public ResponseEntity<?> cambiarContrasena(
            @RequestHeader(value = "X-Cliente-Id", required = false) Long clienteId,
            @RequestBody Map<String, String> datos) {
        
        if (clienteId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "No autenticado"));
        }

        try {
            clienteService.cambiarContrasena(
                clienteId,
                datos.get("contrasenaActual"),
                datos.get("contrasenaNueva")
            );
            return ResponseEntity.ok(Map.of("message", "Contraseña cambiada exitosamente"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Listar todos los clientes (admin)
     * GET /api/clientes
     */
    @GetMapping
    public ResponseEntity<?> listarClientes(
            @RequestHeader(value = "X-Is-Admin", required = false, defaultValue = "false") boolean isAdmin) {
        
        if (!isAdmin) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "Acceso denegado. Se requieren permisos de administrador."));
        }

        try {
            return ResponseEntity.ok(clienteService.listarTodosLosClientes());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Obtener cliente por ID (admin)
     * GET /api/clientes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerClienteById(@PathVariable Long id) {
        try {
            ClienteDTO cliente = clienteService.obtenerCliente(id);
            return ResponseEntity.ok(cliente);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
