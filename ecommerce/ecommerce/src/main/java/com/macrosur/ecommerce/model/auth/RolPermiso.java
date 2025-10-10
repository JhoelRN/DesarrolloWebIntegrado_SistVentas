package com.macrosur.ecommerce.model.auth;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * Entidad para la tabla de unión Rol_Permiso.
 * Representa la relación muchos a muchos entre Rol y Permiso.
 * Se utiliza una clave compuesta para esta tabla.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Rol_Permiso")
@IdClass(RolPermiso.RolPermisoId.class) // Define la clase de la clave compuesta
public class RolPermiso {

    @Id
    @ManyToOne
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    @Id
    @ManyToOne
    @JoinColumn(name = "id_permiso", nullable = false)
    private Permiso permiso;

    /**
     * Clase para la clave compuesta de RolPermiso.
     * Debe implementar Serializable y sobrescribir equals y hashCode.
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RolPermisoId implements Serializable {
        private Long rol; // Corresponde al id de la entidad Rol
        private Long permiso; // Corresponde al id de la entidad Permiso
    }
}