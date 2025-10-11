package com.macrosur.ecommerce.dto;

public class AuthRequest {
    private String correo;
    private String password;
    // getters/setters
    public String getCorreo(){return correo;}
    public void setCorreo(String correo){this.correo=correo;}
    public String getPassword(){return password;}
    public void setPassword(String password){this.password=password;}
}

