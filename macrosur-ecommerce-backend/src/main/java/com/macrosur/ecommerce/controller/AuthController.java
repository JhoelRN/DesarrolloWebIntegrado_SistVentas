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

@RestController
@RequestMapping("/api/auth")
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
}


