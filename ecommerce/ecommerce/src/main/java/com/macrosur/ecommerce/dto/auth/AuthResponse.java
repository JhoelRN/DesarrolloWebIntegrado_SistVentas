package com.macrosur.ecommerce.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para la respuesta de autenticación.
 * Contiene el token JWT y la información básica del usuario autenticado.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long idUsuario;
    private String nombreUsuario;
    private String email;
    private String rol;
    private List<String> permisos;
}