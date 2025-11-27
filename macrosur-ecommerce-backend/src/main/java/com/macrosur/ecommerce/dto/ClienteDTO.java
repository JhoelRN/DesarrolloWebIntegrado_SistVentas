package com.macrosur.ecommerce.dto;

import java.time.LocalDateTime;

/**
 * DTO completo para Cliente - usado en respuestas detalladas
 */
public class ClienteDTO {
    
    private Long clienteId;
    private String nombre;
    private String apellido;
    private String correo;
    private String telefono;
    private LocalDateTime fechaRegistro;
    private String oauthProvider;
    private String oauthId;
    private String avatarUrl;

    // Constructores
    public ClienteDTO() {
    }

    public ClienteDTO(Long clienteId, String nombre, String apellido, String correo) {
        this.clienteId = clienteId;
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

    // Helper methods
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }

    public boolean isOAuthUser() {
        return oauthProvider != null && !oauthProvider.isEmpty();
    }
}
