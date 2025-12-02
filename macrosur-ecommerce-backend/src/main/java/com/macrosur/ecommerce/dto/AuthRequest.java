package com.macrosur.ecommerce.dto;

public class AuthRequest {
    private String correo_corporativo;  // CORRECCIÓN: Usar nombre consistente con BD
    private String contrasena;          // CORRECCIÓN: Usar nombre consistente con BD
    
    // getters/setters
    public String getCorreo_corporativo() { return correo_corporativo; }
    public void setCorreo_corporativo(String correo_corporativo) { this.correo_corporativo = correo_corporativo; }
    
    public String getContrasena() { return contrasena; }
    public void setContrasena(String contrasena) { this.contrasena = contrasena; }
}

