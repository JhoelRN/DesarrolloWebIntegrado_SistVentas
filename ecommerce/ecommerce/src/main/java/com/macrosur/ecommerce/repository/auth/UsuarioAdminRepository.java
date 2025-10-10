package com.macrosur.ecommerce.repository.auth;

import com.macrosur.ecommerce.model.auth.UsuarioAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para la entidad {@link UsuarioAdmin}.
 * Proporciona métodos para interactuar con la tabla 'Usuarios_Admin' en la base de datos.
 */
@Repository
public interface UsuarioAdminRepository extends JpaRepository<UsuarioAdmin, Long> {
    Optional<UsuarioAdmin> findByEmail(String email);
    Optional<UsuarioAdmin> findByNombreUsuario(String nombreUsuario);
    boolean existsByEmail(String email);
    boolean existsByNombreUsuario(String nombreUsuario);
}