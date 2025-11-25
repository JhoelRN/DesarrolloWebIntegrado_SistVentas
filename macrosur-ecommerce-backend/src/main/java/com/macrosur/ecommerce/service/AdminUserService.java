// java
package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.dto.*;
import com.macrosur.ecommerce.entity.*;
import com.macrosur.ecommerce.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    private final UsuarioAdminRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminUserService(UsuarioAdminRepository userRepo, RoleRepository roleRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
    }

    private void validateMacroCorreo(String correo) {
        if (correo == null || !correo.toLowerCase().endsWith("@macrosur.com")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El correo debe terminar en @macrosur.com");
        }
    }

    public List<UsuarioAdminDto> getAdminUsers() {
        return userRepo.findAll().stream().map(this::toDtoMinimal).collect(Collectors.toList());
    }

    public UsuarioAdminDto createAdminUser(CreateUserRequest req) {
        validateMacroCorreo(req.correo_corporativo);
        if (userRepo.existsByCorreo_corporativo(req.correo_corporativo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Correo ya existe");
        }
        Role role = roleRepo.findById(req.rol_id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol no encontrado"));

        UsuarioAdmin u = new UsuarioAdmin();
        u.setNombre(req.nombre);
        u.setApellido(req.apellido);
        u.setCorreo_corporativo(req.correo_corporativo);
        u.setContrasena_hash(passwordEncoder.encode(req.contrasena));
        u.setRole(role);
        u.setActivo(true);
        UsuarioAdmin saved = userRepo.save(u);
        return toDtoMinimal(saved);
    }

    public UsuarioAdminDto updateAdminUser(Long id, UpdateUserRequest req) {
        validateMacroCorreo(req.correo_corporativo);
        UsuarioAdmin u = userRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (!u.getCorreo_corporativo().equals(req.correo_corporativo)
                && userRepo.existsByCorreo_corporativo(req.correo_corporativo)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Correo ya existe");
        }

        Role role = roleRepo.findById(req.rol_id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol no encontrado"));

        u.setNombre(req.nombre);
        u.setApellido(req.apellido);
        u.setCorreo_corporativo(req.correo_corporativo);
        u.setRole(role);
        UsuarioAdmin saved = userRepo.save(u);
        return toDtoMinimal(saved);
    }

    public void deleteAdminUser(Long id) {
        if (!userRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
        }
        userRepo.deleteById(id);
    }

    public UsuarioAdminDto toggleUserStatus(Long id, StatusRequest req) {
        UsuarioAdmin u = userRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        u.setActivo(req.activo);
        UsuarioAdmin saved = userRepo.save(u);
        return toDtoMinimal(saved);
    }

    // mapping básico
    private UsuarioAdminDto toDtoMinimal(UsuarioAdmin u) {
        UsuarioAdminDto dto = new UsuarioAdminDto();
        dto.usuario_admin_id = u.getUsuario_admin_id();
        dto.nombre = u.getNombre();
        dto.apellido = u.getApellido();
        dto.correo_corporativo = u.getCorreo_corporativo();
        dto.activo = u.getActivo();
        if (u.getRole() != null) {
            RoleDto rd = new RoleDto();
            rd.rol_id = u.getRole().getRol_id();
            rd.nombreRol = u.getRole().getNombreRol();
            dto.role = rd;
            if (u.getRole().getPermissions() != null) {
                dto.permissions = u.getRole().getPermissions().stream().map(p -> {
                    PermissionDto pd = new PermissionDto();
                    pd.permiso_id = p.getPermiso_id();
                    pd.nombrePermiso = p.getNombrePermiso();
                    return pd;
                }).collect(Collectors.toSet());
            }
        }
        return dto;
    }
}
