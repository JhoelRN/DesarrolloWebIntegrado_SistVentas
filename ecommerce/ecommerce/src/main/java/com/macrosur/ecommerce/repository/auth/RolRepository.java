package com.macrosur.ecommerce.repository.auth;

import com.macrosur.ecommerce.model.auth.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para la entidad {@link Rol}.
 * Proporciona métodos para interactuar con la tabla 'Roles' en la base de datos.
 */
@Repository
public interface RolRepository extends JpaRepository<Rol, Long> {
    Optional<Rol> findByNombreRol(String nombreRol);
}