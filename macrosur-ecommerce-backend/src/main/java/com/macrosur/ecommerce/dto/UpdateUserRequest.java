// java
package com.macrosur.ecommerce.dto;

public class UpdateUserRequest {
    public String nombre;
    public String apellido;
    public String correo_corporativo;
    public Long rol_id;
    public String contrasena; // opcional: si viene vacío/null, no actualiza contraseña
}
