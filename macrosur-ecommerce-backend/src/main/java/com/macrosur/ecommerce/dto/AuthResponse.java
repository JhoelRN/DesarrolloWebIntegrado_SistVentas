package com.macrosur.ecommerce.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.Set;

public class AuthResponse {
    @JsonProperty("token")
    private String token;
    
    @JsonProperty("usuario_admin_id")
    private Long usuario_admin_id;
    
    @JsonProperty("nombre")
    private String nombre;
    
    @JsonProperty("apellido") 
    private String apellido;
    
    @JsonProperty("correo_corporativo")
    private String correo_corporativo;
    
    @JsonProperty("role")
    private RoleDto role;
    
    @JsonProperty("permissions")
    private Set<PermissionDto> permissions;

    // Constructors
    public AuthResponse() {}

    public AuthResponse(String token) {
        this.token = token;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    
    public Long getUsuario_admin_id() { return usuario_admin_id; }
    public void setUsuario_admin_id(Long usuario_admin_id) { this.usuario_admin_id = usuario_admin_id; }
    
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    
    public String getCorreo_corporativo() { return correo_corporativo; }
    public void setCorreo_corporativo(String correo_corporativo) { this.correo_corporativo = correo_corporativo; }
    
    public RoleDto getRole() { return role; }
    public void setRole(RoleDto role) { this.role = role; }
    
    public Set<PermissionDto> getPermissions() { return permissions; }
    public void setPermissions(Set<PermissionDto> permissions) { this.permissions = permissions; }
}
