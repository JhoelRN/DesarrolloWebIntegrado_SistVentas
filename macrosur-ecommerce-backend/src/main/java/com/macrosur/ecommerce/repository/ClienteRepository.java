package com.macrosur.ecommerce.repository;

import com.macrosur.ecommerce.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repository para gestionar clientes
 */
@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    /**
     * Buscar cliente por correo electrónico
     */
    Optional<Cliente> findByCorreo(String correo);

    /**
     * Buscar cliente por OAuth provider e ID
     */
    @Query("SELECT c FROM Cliente c WHERE c.oauthProvider = :provider AND c.oauthId = :oauthId")
    Optional<Cliente> findByOAuthProviderAndOAuthId(@Param("provider") String provider, @Param("oauthId") String oauthId);

    /**
     * Verificar si existe un correo
     */
    boolean existsByCorreo(String correo);

    /**
     * Verificar si existe un usuario OAuth
     */
    @Query("SELECT CASE WHEN COUNT(c) > 0 THEN true ELSE false END FROM Cliente c WHERE c.oauthProvider = :provider AND c.oauthId = :oauthId")
    boolean existsByOAuthProviderAndOAuthId(@Param("provider") String provider, @Param("oauthId") String oauthId);
}
