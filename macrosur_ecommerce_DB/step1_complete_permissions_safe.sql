USE macrosur_ecommerce;

-- =====================================================
-- SCRIPT INCREMENTAL SEGURO PARA COMPLETAR DATOS
-- Versión que funciona con MySQL en modo seguro
-- =====================================================

-- PASO 1: AGREGAR PERMISOS GRANULARES QUE FALTAN
-- (Los roles ya existen, solo agregamos permisos nuevos)

-- Permisos granulares por módulo
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('VER_PRODUCTOS');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('CREAR_PRODUCTOS');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('EDITAR_PRODUCTOS');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('ELIMINAR_PRODUCTOS');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('VER_CATEGORIAS');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('CREAR_CATEGORIAS');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('EDITAR_CATEGORIAS');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('VER_RESENAS');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('GESTIONAR_RESENAS');

-- Módulo Logística
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('VER_INVENTARIO');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('GESTIONAR_STOCK');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('VER_LOGISTICA');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('GESTIONAR_ENVIOS');

-- Módulo Comercial
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('GESTIONAR_PEDIDOS');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('VER_CLIENTES');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('VER_PROMOCIONES');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('CREAR_PROMOCIONES');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('VER_RECLAMOS');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('GESTIONAR_RECLAMOS');

-- Módulo Administración
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('GESTIONAR_USUARIOS');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('VER_DASHBOARD_ADMIN');

-- Permisos de Reportes (CRÍTICOS PARA JASPERREPORTS)
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('REPORTE_PRODUCTOS');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('REPORTE_INVENTARIO');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('REPORTE_VENTAS');
INSERT IGNORE INTO Permisos (nombre_permiso) VALUES ('REPORTE_USUARIOS');

-- PASO 2: REASIGNAR PERMISOS A ROLES DE FORMA SEGURA
-- Eliminar asignaciones específicas por rol

DELETE FROM Rol_Permiso WHERE rol_id = 1;
DELETE FROM Rol_Permiso WHERE rol_id = 2;
DELETE FROM Rol_Permiso WHERE rol_id = 3;
DELETE FROM Rol_Permiso WHERE rol_id = 4;

-- ADMIN (rol_id: 1) - Acceso total a todo
INSERT INTO Rol_Permiso (rol_id, permiso_id) 
SELECT 1, permiso_id FROM Permisos;

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
    'VER_CATEGORIAS', 'CREAR_CATEGORIAS', 'EDITAR_CATEGORIAS', 'CRUD_PRODUCTOS',
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

-- PASO 3: AGREGAR USUARIOS GESTORES QUE FALTAN
-- (Tu usuario admin ya existe, solo agregamos los otros)

INSERT IGNORE INTO Usuarios_Admin (rol_id, nombre, apellido, correo_corporativo, contrasena_hash, activo)
VALUES 
(2, 'Carlos', 'Logistics', 'carlos.logistics@macrosur.com', '$2b$10$8K1p2HjBkOUCGpJ5kRvCzeuLBpJ1QeIyI8bYvR4vHZQxnT9sF1YoG', true),
(3, 'Maria', 'Products', 'maria.products@macrosur.com', '$2b$10$vR3Q9tLxM2nBcS6kY8fJdeHpX5rE4wK9jC7vF2sN1zG8qA5bL0mP3', true),
(4, 'Juan', 'Sales', 'juan.sales@macrosur.com', '$2b$10$nH8L4fG2mT5rE9pK6sB3jeQwV7xF1cN8zR9qA4yH5gM2uP0sL7vX6', true);

-- PASO 4: AGREGAR CAMPO FECHA_CREACION SI NO EXISTE
-- Verificar si la columna existe antes de agregarla
SET @column_exists = (
    SELECT COUNT(*) 
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA = 'macrosur_ecommerce' 
    AND TABLE_NAME = 'Usuarios_Admin' 
    AND COLUMN_NAME = 'fecha_creacion'
);

-- Usar prepared statement para agregar columna condicionalmente
SET @sql = IF(@column_exists = 0, 
    'ALTER TABLE Usuarios_Admin ADD COLUMN fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP', 
    'SELECT "Columna fecha_creacion ya existe" as info'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- VERIFICACIÓN
SELECT 'PERMISOS ACTUALIZADOS' as status, COUNT(*) as total FROM Permisos;
SELECT 'USUARIOS COMPLETOS' as status, COUNT(*) as total FROM Usuarios_Admin;

-- Mostrar asignaciones por rol
SELECT r.nombre_rol, COUNT(rp.permiso_id) as permisos_asignados
FROM Roles r
LEFT JOIN Rol_Permiso rp ON r.rol_id = rp.rol_id
GROUP BY r.rol_id, r.nombre_rol
ORDER BY r.rol_id;

SELECT 'PASO 1 COMPLETADO - PERMISOS Y USUARIOS LISTOS' as resultado;