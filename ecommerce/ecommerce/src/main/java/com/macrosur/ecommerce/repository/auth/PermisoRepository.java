package com.macrosur.ecommerce.repository.auth;

import com.macrosur.ecommerce.model.auth.Permiso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositorio para la entidad {@link Permiso}.
 * Proporciona métodos para interactuar con la tabla 'Permisos' en la base de datos.
 */
@Repository
public interface PermisoRepository extends JpaRepository<Permiso, Long> {
    Optional<Permiso> findByNombrePermiso(String nombrePermiso);
}