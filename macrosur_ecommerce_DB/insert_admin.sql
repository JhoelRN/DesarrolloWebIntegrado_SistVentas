USE macrosur_ecommerce;

-- Inserciones de ejemplo para probar la autenticación y roles
-- 1) Roles
INSERT INTO Roles (nombre_rol) VALUES ('ADMIN');
INSERT INTO Roles (nombre_rol) VALUES ('GESTOR_LOGISTICA');
INSERT INTO Roles (nombre_rol) VALUES ('GESTOR_PRODUCTOS');
INSERT INTO Roles (nombre_rol) VALUES ('GESTOR_COMERCIAL');

-- 2) Permisos (ejemplos)
INSERT INTO Permisos (nombre_permiso) VALUES ('CRUD_PRODUCTOS');
INSERT INTO Permisos (nombre_permiso) VALUES ('VER_PEDIDOS');
INSERT INTO Permisos (nombre_permiso) VALUES ('AUTORIZAR_REPOSICION');
INSERT INTO Permisos (nombre_permiso) VALUES ('GESTION_USUARIOS');

-- 3) Asignar permisos al rol ADMIN (suponiendo IDs autogenerados)
-- Ajusta los IDs según los generados en tu BD (usa SELECT para comprobar)
INSERT INTO Rol_Permiso (rol_id, permiso_id) VALUES (1, 1);
INSERT INTO Rol_Permiso (rol_id, permiso_id) VALUES (1, 2);
INSERT INTO Rol_Permiso (rol_id, permiso_id) VALUES (1, 3);
INSERT INTO Rol_Permiso (rol_id, permiso_id) VALUES (1, 4);

-- 4) Crear un usuario admin de prueba
-- IMPORTANTE: Guarda en la columna `contrasena_hash` el hash de la contraseña, NO la contraseña en claro.
-- Ejemplo con bcrypt (node):
--   const bcrypt = require('bcrypt');
--   const hash = await bcrypt.hash('admin', 10);
-- Luego reemplaza '<HASH_AQUI>' por el valor resultante.

INSERT INTO Usuarios_Admin (rol_id, nombre, apellido, correo_corporativo, contrasena_hash, activo)
VALUES (1, 'Admin', 'Macrosur', 'admin@macrosur.com', '$2b$10$TvU.lZ3YESXdXuWBI.9uv.F0E6.Fus87v036KhpWAa0hm07MqzFxe', true);

-- Si no quieres generar hash ahora para pruebas locales, puedes temporalmente usar un hash conocido
-- generado con bcrypt para la contraseña 'admin'. Ejemplo (Linux/Mac):
--   node -e "const bcrypt=require('bcrypt'); bcrypt.hash('admin',10).then(h=>console.log(h))"
