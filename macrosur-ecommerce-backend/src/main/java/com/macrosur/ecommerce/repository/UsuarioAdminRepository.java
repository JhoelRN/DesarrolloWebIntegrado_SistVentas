package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.UsuarioAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioAdminRepository extends JpaRepository<UsuarioAdmin, Long> {
    Optional<UsuarioAdmin> findByCorreo(String correo);
    boolean existsByCorreo(String correo);
}
