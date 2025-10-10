package com.macrosur.ecommerce.model.auth;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * Entidad que representa un permiso en el sistema.
 * Un permiso define una acción específica que un usuario puede realizar.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Permisos")
public class Permiso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_permiso")
    private Long idPermiso;

    @Column(name = "nombre_permiso", unique = true, nullable = false, length = 50)
    private String nombrePermiso;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    // Relación ManyToMany con Rol a través de la tabla RolPermiso
    @ManyToMany(mappedBy = "permisos")
    private Set<Rol> roles = new HashSet<>();
}