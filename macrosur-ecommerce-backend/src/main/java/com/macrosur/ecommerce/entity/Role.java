// java
package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "Roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rol_id")
    private Long rol_id;

    @Column(name = "nombre_rol", nullable = false)
    private String nombreRol;

    @OneToMany(mappedBy = "role")
    private Set<UsuarioAdmin> usuarios;

    @ManyToMany
    @JoinTable(name = "Rol_Permiso",
            joinColumns = @JoinColumn(name = "rol_id"),
            inverseJoinColumns = @JoinColumn(name = "permiso_id"))
    private Set<Permission> permissions;

    // getters y setters
    public Long getRol_id() { return rol_id; }
    public void setRol_id(Long rol_id) { this.rol_id = rol_id; }

    public String getNombreRol() { return nombreRol; }
    public void setNombreRol(String nombreRol) { this.nombreRol = nombreRol; }

    public Set<UsuarioAdmin> getUsuarios() { return usuarios; }
    public void setUsuarios(Set<UsuarioAdmin> usuarios) { this.usuarios = usuarios; }

    public Set<Permission> getPermissions() { return permissions; }
    public void setPermissions(Set<Permission> permissions) { this.permissions = permissions; }
}
