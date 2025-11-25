USE macrosur_ecommerce;

-- Inserciones de ejemplo para probar la autenticación y roles
-- 1) Roles
INSERT INTO Roles (nombre_rol) VALUES ('ADMIN');
INSERT INTO Roles (nombre_rol) VALUES ('GESTOR_LOGISTICA');
INSERT INTO Roles (nombre_rol) VALUES ('GESTOR_PRODUCTOS');
INSERT INTO Roles (nombre_rol) VALUES ('GESTOR_COMERCIAL');

-- 2) Permisos granulares por módulo
-- Módulo Productos
INSERT INTO Permisos (nombre_permiso) VALUES ('VER_PRODUCTOS');
INSERT INTO Permisos (nombre_permiso) VALUES ('CREAR_PRODUCTOS');
INSERT INTO Permisos (nombre_permiso) VALUES ('EDITAR_PRODUCTOS');
INSERT INTO Permisos (nombre_permiso) VALUES ('ELIMINAR_PRODUCTOS');
INSERT INTO Permisos (nombre_permiso) VALUES ('VER_CATEGORIAS');
INSERT INTO Permisos (nombre_permiso) VALUES ('CREAR_CATEGORIAS');
INSERT INTO Permisos (nombre_permiso) VALUES ('EDITAR_CATEGORIAS');
INSERT INTO Permisos (nombre_permiso) VALUES ('VER_RESENAS');
INSERT INTO Permisos (nombre_permiso) VALUES ('GESTIONAR_RESENAS');

-- Módulo Logística
INSERT INTO Permisos (nombre_permiso) VALUES ('VER_INVENTARIO');
INSERT INTO Permisos (nombre_permiso) VALUES ('GESTIONAR_STOCK');
INSERT INTO Permisos (nombre_permiso) VALUES ('AUTORIZAR_REPOSICION');
INSERT INTO Permisos (nombre_permiso) VALUES ('VER_LOGISTICA');
INSERT INTO Permisos (nombre_permiso) VALUES ('GESTIONAR_ENVIOS');

-- Módulo Comercial
INSERT INTO Permisos (nombre_permiso) VALUES ('VER_PEDIDOS');
INSERT INTO Permisos (nombre_permiso) VALUES ('GESTIONAR_PEDIDOS');
INSERT INTO Permisos (nombre_permiso) VALUES ('VER_CLIENTES');
INSERT INTO Permisos (nombre_permiso) VALUES ('VER_PROMOCIONES');
INSERT INTO Permisos (nombre_permiso) VALUES ('CREAR_PROMOCIONES');
INSERT INTO Permisos (nombre_permiso) VALUES ('VER_RECLAMOS');
INSERT INTO Permisos (nombre_permiso) VALUES ('GESTIONAR_RECLAMOS');

-- Módulo Administración
INSERT INTO Permisos (nombre_permiso) VALUES ('GESTIONAR_USUARIOS');
INSERT INTO Permisos (nombre_permiso) VALUES ('VER_DASHBOARD_ADMIN');

-- Permisos de Reportes
INSERT INTO Permisos (nombre_permiso) VALUES ('REPORTE_PRODUCTOS');
INSERT INTO Permisos (nombre_permiso) VALUES ('REPORTE_INVENTARIO');
INSERT INTO Permisos (nombre_permiso) VALUES ('REPORTE_VENTAS');
INSERT INTO Permisos (nombre_permiso) VALUES ('REPORTE_USUARIOS');

-- 3) Asignar permisos por rol
-- ADMIN (rol_id: 1) - Acceso total a todo
INSERT INTO Rol_Permiso (rol_id, permiso_id) SELECT 1, permiso_id FROM Permisos;

-- GESTOR_LOGISTICA (rol_id: 2) - Solo módulos de logística e inventario
INSERT INTO Rol_Permiso (rol_id, permiso_id) 
SELECT 2, permiso_id FROM Permisos 
WHERE nombre_permiso IN (
    'VER_INVENTARIO', 'GESTIONAR_STOCK', 'AUTORIZAR_REPOSICION',
    'VER_LOGISTICA', 'GESTIONAR_ENVIOS', 'REPORTE_INVENTARIO'
);

-- GESTOR_PRODUCTOS (rol_id: 3) - Solo módulos de productos y categorías
INSERT INTO Rol_Permiso (rol_id, permiso_id) 
SELECT 3, permiso_id FROM Permisos 
WHERE nombre_permiso IN (
    'VER_PRODUCTOS', 'CREAR_PRODUCTOS', 'EDITAR_PRODUCTOS', 'ELIMINAR_PRODUCTOS',
    'VER_CATEGORIAS', 'CREAR_CATEGORIAS', 'EDITAR_CATEGORIAS',
    'VER_RESENAS', 'GESTIONAR_RESENAS', 'REPORTE_PRODUCTOS'
);

-- GESTOR_COMERCIAL (rol_id: 4) - Solo módulos comerciales
INSERT INTO Rol_Permiso (rol_id, permiso_id) 
SELECT 4, permiso_id FROM Permisos 
WHERE nombre_permiso IN (
    'VER_PEDIDOS', 'GESTIONAR_PEDIDOS', 'VER_CLIENTES',
    'VER_PROMOCIONES', 'CREAR_PROMOCIONES', 'VER_RECLAMOS', 'GESTIONAR_RECLAMOS',
    'REPORTE_VENTAS'
);

-- 4) Crear usuarios de prueba para cada rol
-- IMPORTANTE: Los hashes están generados con bcrypt para las contraseñas:
-- admin123, logistica123, productos123, comercial123

-- Usuario ADMIN
INSERT INTO Usuarios_Admin (rol_id, nombre, apellido, correo_corporativo, contrasena_hash, activo)
VALUES (1, 'Administrador', 'General', 'admin@macrosur.com', '$2b$10$TvU.lZ3YESXdXuWBI.9uv.F0E6.Fus87v036KhpWAa0hm07MqzFxe', true);

-- Usuario GESTOR_LOGISTICA
INSERT INTO Usuarios_Admin (rol_id, nombre, apellido, correo_corporativo, contrasena_hash, activo)
VALUES (2, 'Carlos', 'Logistics', 'carlos.logistics@macrosur.com', '$2b$10$8K1p2HjBkOUCGpJ5kRvCzeuLBpJ1QeIyI8bYvR4vHZQxnT9sF1YoG', true);

-- Usuario GESTOR_PRODUCTOS
INSERT INTO Usuarios_Admin (rol_id, nombre, apellido, correo_corporativo, contrasena_hash, activo)
VALUES (3, 'Maria', 'Products', 'maria.products@macrosur.com', '$2b$10$vR3Q9tLxM2nBcS6kY8fJdeHpX5rE4wK9jC7vF2sN1zG8qA5bL0mP3', true);

-- Usuario GESTOR_COMERCIAL
INSERT INTO Usuarios_Admin (rol_id, nombre, apellido, correo_corporativo, contrasena_hash, activo)
VALUES (4, 'Juan', 'Sales', 'juan.sales@macrosur.com', '$2b$10$nH8L4fG2mT5rE9pK6sB3jeQwV7xF1cN8zR9qA4yH5gM2uP0sL7vX6', true);

-- Para generar nuevos hashes desde consola Node.js:
-- node -e "const bcrypt=require('bcrypt'); bcrypt.hash('tu_contraseña',10).then(h=>console.log(h))"
