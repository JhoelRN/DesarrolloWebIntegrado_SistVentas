// java
package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "Permisos")
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permiso_id")
    private Long permiso_id;

    @Column(name = "nombre_permiso", nullable = false)
    private String nombrePermiso;

    @ManyToMany(mappedBy = "permissions")
    private Set<Role> roles;

    // getters y setters
    public Long getPermiso_id() { return permiso_id; }
    public void setPermiso_id(Long permiso_id) { this.permiso_id = permiso_id; }

    public String getNombrePermiso() { return nombrePermiso; }
    public void setNombrePermiso(String nombrePermiso) { this.nombrePermiso = nombrePermiso; }

    public Set<Role> getRoles() { return roles; }
    public void setRoles(Set<Role> roles) { this.roles = roles; }
}

