package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidad Cliente - Representa usuarios clientes del e-commerce
 * Soporta registro manual y OAuth2 (Google, Microsoft)
 */
@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cliente_id")
    private Long clienteId;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;

    @Column(name = "correo", nullable = false, unique = true, length = 150)
    private String correo;

    @Column(name = "contrasena_hash", length = 255)
    private String contrasenaHash;

    @Column(name = "telefono", length = 20)
    private String telefono;

    @Column(name = "fecha_registro", nullable = false, updatable = false)
    private LocalDateTime fechaRegistro;

    // OAuth2 fields (opcional - si decides agregarlas a la DB)
    @Column(name = "oauth_provider", length = 50)
    private String oauthProvider; // google, microsoft, null para manual

    @Column(name = "oauth_id", length = 255)
    private String oauthId;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    // Relaciones
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Resena> resenas = new ArrayList<>();

    // Constructores
    public Cliente() {
        this.fechaRegistro = LocalDateTime.now();
    }

    public Cliente(String nombre, String apellido, String correo) {
        this();
        this.nombre = nombre;
        this.apellido = apellido;
        this.correo = correo;
    }

    // Getters y Setters
    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getContrasenaHash() {
        return contrasenaHash;
    }

    public void setContrasenaHash(String contrasenaHash) {
        this.contrasenaHash = contrasenaHash;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(LocalDateTime fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public String getOauthProvider() {
        return oauthProvider;
    }

    public void setOauthProvider(String oauthProvider) {
        this.oauthProvider = oauthProvider;
    }

    public String getOauthId() {
        return oauthId;
    }

    public void setOauthId(String oauthId) {
        this.oauthId = oauthId;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public List<Resena> getResenas() {
        return resenas;
    }

    public void setResenas(List<Resena> resenas) {
        this.resenas = resenas;
    }

    // Helper methods
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }

    public boolean isOAuthUser() {
        return oauthProvider != null && !oauthProvider.isEmpty();
    }
}
