// java
package com.macrosur.ecommerce.dto;

import java.util.Set;

public class UsuarioAdminDto {
    public Long usuario_admin_id;
    public String nombre;
    public String apellido;
    public String correo_corporativo;
    public Boolean activo;
    public Long rol_id; // ID del rol para compatibilidad con frontend
    public RoleDto role;
    public Set<PermissionDto> permissions;
}
