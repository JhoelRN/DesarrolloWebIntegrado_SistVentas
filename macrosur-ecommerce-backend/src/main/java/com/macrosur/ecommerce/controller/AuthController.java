// java
package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.dto.*;
import com.macrosur.ecommerce.entity.UsuarioAdmin;
import com.macrosur.ecommerce.repository.UsuarioAdminRepository;
import com.macrosur.ecommerce.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioAdminRepository userRepo;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(UsuarioAdminRepository userRepo, 
                         AuthenticationManager authenticationManager,
                         UserDetailsService userDetailsService,
                         JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        try {
            // Verificar que los datos lleguen correctamente
            if (authRequest.getCorreo_corporativo() == null || authRequest.getContrasena() == null) {
                throw new BadCredentialsException("Credenciales faltantes");
            }
            
            // Autenticar usuario
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    authRequest.getCorreo_corporativo(), 
                    authRequest.getContrasena()
                )
            );

            System.out.println("✅ Authentication successful");

            // Cargar detalles del usuario
            UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getCorreo_corporativo());
            
            // Generar token JWT
            String token = jwtUtil.generateToken(userDetails.getUsername());

            // Obtener datos del usuario para la respuesta
            UsuarioAdmin usuario = userRepo.findByCorreoWithRoleAndPermissions(authRequest.getCorreo_corporativo())
                .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));

            System.out.println("✅ User found: " + usuario.getNombre() + " " + usuario.getApellido());

            // Crear respuesta
            AuthResponse response = new AuthResponse();
            response.setToken(token);
            response.setUsuario_admin_id(usuario.getUsuario_admin_id());
            response.setNombre(usuario.getNombre());
            response.setApellido(usuario.getApellido());
            response.setCorreo_corporativo(usuario.getCorreo_corporativo());
            
            if (usuario.getRole() != null) {
                RoleDto roleDto = new RoleDto();
                roleDto.rol_id = usuario.getRole().getRol_id();
                roleDto.nombreRol = usuario.getRole().getNombreRol();
                response.setRole(roleDto);

                if (usuario.getRole().getPermissions() != null) {
                    response.setPermissions(usuario.getRole().getPermissions().stream().map(p -> {
                        PermissionDto pd = new PermissionDto();
                        pd.permiso_id = p.getPermiso_id();
                        pd.nombrePermiso = p.getNombrePermiso();
                        return pd;
                    }).collect(java.util.stream.Collectors.toSet()));
                }
            }

            System.out.println("✅ Login successful, returning response");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ Login failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(401).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioAdminDto> me() {
        System.out.println("🔍 /me endpoint called");
        
        try {
            var authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null) {
                System.out.println("❌ No authentication found");
                return ResponseEntity.status(401).build();
            }
            
            String correo = authentication.getName();
            System.out.println("✅ Authenticated user: " + correo);
            
            UsuarioAdmin usuario = userRepo.findByCorreoWithRoleAndPermissions(correo)
                    .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "Usuario no encontrado"));
            
            System.out.println("✅ User found in DB: " + usuario.getNombre());
            UsuarioAdminDto dto = new UsuarioAdminDto();
        dto.usuario_admin_id = usuario.getUsuario_admin_id();
        dto.nombre = usuario.getNombre();
        dto.apellido = usuario.getApellido();
        dto.correo_corporativo = usuario.getCorreo_corporativo();
        dto.activo = usuario.getActivo();
        if (usuario.getRole() != null) {
            RoleDto rd = new RoleDto();
            rd.rol_id = usuario.getRole().getRol_id();
            rd.nombreRol = usuario.getRole().getNombreRol();
            dto.role = rd;
            if (usuario.getRole().getPermissions() != null) {
                dto.permissions = usuario.getRole().getPermissions().stream().map(p -> {
                    PermissionDto pd = new PermissionDto();
                    pd.permiso_id = p.getPermiso_id();
                    pd.nombrePermiso = p.getNombrePermiso();
                    return pd;
                }).collect(java.util.stream.Collectors.toSet());
            }
        }
        
        System.out.println("✅ Returning user data for /me");
        return ResponseEntity.ok(dto);
        
        } catch (Exception e) {
            System.out.println("❌ Error in /me endpoint: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateToken() {
        // Si llegamos aquí, significa que el token es válido (gracias al JwtFilter)
        return ResponseEntity.ok(true);
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Auth controller is working!");
    }
}
