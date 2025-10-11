package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.entity.UsuarioAdmin;
import com.macrosur.ecommerce.repository.UsuarioAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioAdminRepository usuarioRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UsuarioAdmin user = usuarioRepo.findByCorreo(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        // Por ahora devolvemos el usuario con un rol simple basado en rolId (puedes mapear mejor después)
        return User.builder()
                .username(user.getCorreo())
                .password(user.getContrasenaHash())
                .disabled(user.getActivo() == null ? false : !user.getActivo())
                .authorities(Collections.emptyList()) // añade authorities tras mapear roles/permissions después
                .build();
    }
}
