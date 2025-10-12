// java
package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.AuthRequest;
import com.macrosur.ecommerce.dto.AuthResponse;
import com.macrosur.ecommerce.entity.UsuarioAdmin;
import com.macrosur.ecommerce.repository.UsuarioAdminRepository;
import com.macrosur.ecommerce.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://127.0.0.1:5173"})
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthenticationManager authManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioAdminRepository usuarioRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest req) {
        try {
            authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getCorreo(), req.getPassword())
            );
            String token = jwtUtil.generateToken(req.getCorreo());
            log.info("AUTH LOGIN -> correo={}", req.getCorreo());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (AuthenticationException ex) {
            log.warn("Autenticación fallida para correo={}", req.getCorreo());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UsuarioAdmin user) {
        if (usuarioRepo.existsByCorreo(user.getCorreo())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Correo ya registrado");
        }
        user.setContrasenaHash(passwordEncoder.encode(user.getContrasenaHash()));
        usuarioRepo.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario creado");
    }

    @PostMapping("/validate")
    public ResponseEntity<Void> validateToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtil.validateToken(token)) {
                    return ResponseEntity.ok().build();
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            log.warn("Error validando token: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioAdmin> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String correo = jwtUtil.extractUsername(token);
                if (correo != null && jwtUtil.validateToken(token)) {
                    Optional<UsuarioAdmin> userOpt = usuarioRepo.findByCorreo(correo);
                    if (userOpt.isPresent()) {
                        UsuarioAdmin user = userOpt.get();
                        // No devolver la contraseña
                        user.setContrasenaHash(null);
                        return ResponseEntity.ok(user);
                    }
                }
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            log.warn("Error obteniendo usuario actual: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}


