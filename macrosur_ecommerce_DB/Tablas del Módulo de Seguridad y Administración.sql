use macrosur_ecommerce;
-- 1. ROLES Y PERMISOS (SEGURIDAD BACKEND)
CREATE TABLE Roles (
    rol_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE -- Ej: Administrador General, Gestor de Logística
);

CREATE TABLE Permisos (
    permiso_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_permiso VARCHAR(100) NOT NULL UNIQUE -- Ej: CRUD_Productos, Autorizar_Reposicion
);

CREATE TABLE Rol_Permiso (
    rol_id INT,
    permiso_id INT,
    PRIMARY KEY (rol_id, permiso_id),
    FOREIGN KEY (rol_id) REFERENCES Roles(rol_id),
    FOREIGN KEY (permiso_id) REFERENCES Permisos(permiso_id)
);

CREATE TABLE Usuarios_Admin (
    usuario_admin_id INT PRIMARY KEY AUTO_INCREMENT,
    rol_id INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo_corporativo VARCHAR(150) NOT NULL UNIQUE, -- Debe terminar en @macrosur.com
    contrasena_hash VARCHAR(255) NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (rol_id) REFERENCES Roles(rol_id),
    CHECK (correo_corporativo LIKE '%@macrosur.com')
);