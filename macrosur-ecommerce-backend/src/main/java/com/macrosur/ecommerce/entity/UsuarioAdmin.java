// java
package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Usuarios_Admin")
public class UsuarioAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_admin_id")
    private Long usuario_admin_id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rol_id")
    private Role role;

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellido", nullable = false)
    private String apellido;

    @Column(name = "correo_corporativo", nullable = false, unique = true)
    private String correo_corporativo;

    @Column(name = "contrasena_hash", nullable = false)
    private String contrasena_hash;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    // getters y setters
    public Long getUsuario_admin_id() { return usuario_admin_id; }
    public void setUsuario_admin_id(Long usuario_admin_id) { this.usuario_admin_id = usuario_admin_id; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getCorreo_corporativo() { return correo_corporativo; }
    public void setCorreo_corporativo(String correo_corporativo) { this.correo_corporativo = correo_corporativo; }

    public String getContrasena_hash() { return contrasena_hash; }
    public void setContrasena_hash(String contrasena_hash) { this.contrasena_hash = contrasena_hash; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    // conveniencia: obtener permisos desde el rol (si está cargado)
    public java.util.Set<Permission> getPermissions() {
        return role != null ? role.getPermissions() : java.util.Collections.emptySet();
    }
}
