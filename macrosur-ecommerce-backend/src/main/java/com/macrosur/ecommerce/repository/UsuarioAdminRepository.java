// java
package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.UsuarioAdmin;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UsuarioAdminRepository extends JpaRepository<UsuarioAdmin, Long> {

    @Query("SELECT u FROM UsuarioAdmin u WHERE u.correo_corporativo = :correo_corporativo")
    Optional<UsuarioAdmin> findByCorreo_corporativo(@Param("correo_corporativo") String correo_corporativo);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM UsuarioAdmin u WHERE u.correo_corporativo = :correo_corporativo")
    boolean existsByCorreo_corporativo(@Param("correo_corporativo") String correo_corporativo);

    @Query("SELECT u FROM UsuarioAdmin u " +
            "LEFT JOIN FETCH u.role r " +
            "LEFT JOIN FETCH r.permissions " +
            "WHERE u.correo_corporativo = :correo_corporativo")
    Optional<UsuarioAdmin> findByCorreoWithRoleAndPermissions(@Param("correo_corporativo") String correo_corporativo);
}

