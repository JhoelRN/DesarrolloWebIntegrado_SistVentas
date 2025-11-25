package com.macrosur.ecommerce.service;

import com.macrosur.ecommerce.entity.UsuarioAdmin;
import com.macrosur.ecommerce.entity.Permission;
import com.macrosur.ecommerce.repository.UsuarioAdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UsuarioAdminRepository usuarioRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // CORRECCIÓN: Usar el método correcto del repository
        UsuarioAdmin user = usuarioRepo.findByCorreoWithRoleAndPermissions(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
        
        // Verificar que el usuario esté activo
        if (user.getActivo() == null || !user.getActivo()) {
            throw new UsernameNotFoundException("Usuario inactivo: " + username);
        }

        // CORRECCIÓN: Cargar authorities desde los permisos del rol
        Set<SimpleGrantedAuthority> authorities = user.getPermissions().stream()
                .map(permission -> new SimpleGrantedAuthority("ROLE_" + permission.getNombrePermiso()))
                .collect(Collectors.toSet());

        // Agregar el rol principal como authority
        if (user.getRole() != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().getNombreRol()));
        }

        return User.builder()
                .username(user.getCorreo_corporativo()) // CORRECCIÓN: Getter correcto
                .password(user.getContrasena_hash())     // CORRECCIÓN: Getter correcto
                .disabled(false) // Ya verificamos que esté activo arriba
                .authorities(authorities) // CORRECCIÓN: Authorities reales
                .build();
    }
}
