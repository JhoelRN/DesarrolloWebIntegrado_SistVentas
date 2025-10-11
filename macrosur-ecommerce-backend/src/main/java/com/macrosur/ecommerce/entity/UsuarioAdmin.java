package com.macrosur.ecommerce.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "Usuarios_Admin")
public class UsuarioAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_admin_id")
    private Long id;

    @Column(name = "rol_id", nullable = false)
    private Integer rolId; // manejamos Rol por id inicialmente

    @Column(name = "nombre", nullable = false)
    private String nombre;

    @Column(name = "apellido", nullable = false)
    private String apellido;

    @Column(name = "correo_corporativo", nullable = false, unique = true)
    private String correo;

    @Column(name = "contrasena_hash", nullable = false)
    private String contrasenaHash;

    @Column(name = "activo")
    private Boolean activo = true;

    // getters y setters (o usa Lombok: @Data)
    // Constructor vacío + constructor con campos si lo necesitas
    public UsuarioAdmin() {}

    // getters & setters ...
    // (copiables; si usas Lombok pon @Data sobre la clase y remueve métodos)
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getRolId() { return rolId; }
    public void setRolId(Integer rolId) { this.rolId = rolId; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public String getContrasenaHash() { return contrasenaHash; }
    public void setContrasenaHash(String contrasenaHash) { this.contrasenaHash = contrasenaHash; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
