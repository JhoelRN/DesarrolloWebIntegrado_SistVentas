package com.macrosur.ecommerce.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * DTO para representar la información de un rol.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO {
    private Long idRol;
    private String nombreRol;
    private String descripcion;
    private Set<String> permisos; // Nombres de los permisos asociados
}