package com.macrosur.ecommerce.model.auth;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Entidad que representa un usuario administrador en el sistema.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "Usuarios_Admin")
public class UsuarioAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario_admin")
    private Long idUsuarioAdmin;

    @Column(name = "nombre_usuario", unique = true, nullable = false, length = 50)
    private String nombreUsuario;

    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "fecha_creacion", nullable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "ultimo_acceso")
    private LocalDateTime ultimoAcceso;

    @Column(name = "activo", nullable = false)
    private Boolean activo;

    // Relación ManyToOne con Rol (un usuario tiene un rol)
    @ManyToOne(fetch = FetchType.EAGER) // Carga el rol junto con el usuario
    @JoinColumn(name = "id_rol", nullable = false)
    private Rol rol;

    @PrePersist
    protected void onCreate() {
        fechaCreacion = LocalDateTime.now();
        if (activo == null) {
            activo = true; // Por defecto, un nuevo usuario está activo
        }
    }

    @PreUpdate
    protected void onUpdate() {
        // Puedes añadir lógica aquí si necesitas actualizar 'ultimoAcceso'
        // o cualquier otro campo en cada actualización.
    }
}