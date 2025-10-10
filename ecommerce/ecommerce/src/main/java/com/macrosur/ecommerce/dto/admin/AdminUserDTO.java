package com.macrosur.ecommerce.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para representar la información de un usuario administrador.
 * No incluye la contraseña por seguridad.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserDTO {
    private Long idUsuarioAdmin;
    private String nombreUsuario;
    private String email;
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimoAcceso;
    private Boolean activo;
    private RoleDTO rol; // Incluye el DTO del rol
}