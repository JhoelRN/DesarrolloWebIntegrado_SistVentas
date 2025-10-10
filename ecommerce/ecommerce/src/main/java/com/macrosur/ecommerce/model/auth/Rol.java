package com.macrosur.ecommerce.model.auth;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

/**
 * Entidad que representa un rol en el sistema.
 * Un rol agrupa un conjunto de permisos y puede ser asignado a usuarios.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Roles")
public class Rol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_rol")
    private Long idRol;

    @Column(name = "nombre_rol", unique = true, nullable = false, length = 50)
    private String nombreRol;

    @Column(name = "descripcion", length = 255)
    private String descripcion;

    // Relación ManyToMany con Permiso a través de la tabla intermedia Rol_Permiso
    @ManyToMany(fetch = FetchType.EAGER) // Carga los permisos junto con el rol
    @JoinTable(
            name = "Rol_Permiso",
            joinColumns = @JoinColumn(name = "id_rol"),
            inverseJoinColumns = @JoinColumn(name = "id_permiso")
    )
    private Set<Permiso> permisos = new HashSet<>();

    // Relación OneToMany con UsuarioAdmin (un rol puede tener muchos usuarios)
    @OneToMany(mappedBy = "rol", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<UsuarioAdmin> usuarios = new HashSet<>();
}