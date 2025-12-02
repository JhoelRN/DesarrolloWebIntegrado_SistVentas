package com.macrosur.ecommerce.controller;

import com.macrosur.ecommerce.entity.UsuarioAdmin;
import com.macrosur.ecommerce.repository.UsuarioAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioAdminRepository repo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<UsuarioAdmin> all(){ return repo.findAll(); }

    @GetMapping("/{id}")
    public UsuarioAdmin getOne(@PathVariable Long id){ return repo.findById(id).orElse(null); }

    @PostMapping
    public UsuarioAdmin create(@RequestBody UsuarioAdmin u){
        u.setContrasena_hash(passwordEncoder.encode(u.getContrasena_hash()));
        return repo.save(u);
    }

    @PutMapping("/{id}")
    public UsuarioAdmin update(@PathVariable Long id, @RequestBody UsuarioAdmin u){
        return repo.findById(id).map(existing -> {
            existing.setNombre(u.getNombre());
            existing.setApellido(u.getApellido());
            // CORRECCIÓN: No existe setRolId, usar setRole
            if (u.getRole() != null) {
                existing.setRole(u.getRole());
            }
            if (u.getContrasena_hash() != null && !u.getContrasena_hash().isBlank()) {
                existing.setContrasena_hash(passwordEncoder.encode(u.getContrasena_hash()));
            }
            existing.setActivo(u.getActivo());
            return repo.save(existing);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){ repo.deleteById(id); }
}
