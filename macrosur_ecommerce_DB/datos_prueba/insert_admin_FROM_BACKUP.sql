-- ========================================================================
-- DATOS EXTRAÍDOS DEL BACKUP REAL DE MYSQL WORKBENCH
-- Fecha de extracción: 2025-11-25 08:51:04
-- Fuente: CURRENT_SCHEMA_WITH_DATA_20251125_085104.sql
-- ========================================================================

USE macrosur_ecommerce;

-- Limpiar tablas en orden correcto (respetando foreign keys)
SET FOREIGN_KEY_CHECKS=0;
TRUNCATE TABLE Usuarios_Admin;
TRUNCATE TABLE Rol_Permiso;
TRUNCATE TABLE Permisos;
TRUNCATE TABLE Roles;
SET FOREIGN_KEY_CHECKS=1;

-- ========================================================================
-- 1) ROLES (4 roles del sistema)
-- ========================================================================
INSERT INTO `roles` VALUES 
(1,'ADMIN'),
(4,'GESTOR_COMERCIAL'),
(2,'GESTOR_LOGISTICA'),
(3,'GESTOR_PRODUCTOS');

-- ========================================================================
-- 2) PERMISOS (29 permisos granulares)
-- ========================================================================
INSERT INTO `permisos` VALUES 
(3,'AUTORIZAR_REPOSICION'),
(10,'CREAR_CATEGORIAS'),
(6,'CREAR_PRODUCTOS'),
(21,'CREAR_PROMOCIONES'),
(1,'CRUD_PRODUCTOS'),
(11,'EDITAR_CATEGORIAS'),
(7,'EDITAR_PRODUCTOS'),
(8,'ELIMINAR_PRODUCTOS'),
(4,'GESTION_USUARIOS'),
(17,'GESTIONAR_ENVIOS'),
(18,'GESTIONAR_PEDIDOS'),
(23,'GESTIONAR_RECLAMOS'),
(13,'GESTIONAR_RESENAS'),
(15,'GESTIONAR_STOCK'),
(24,'GESTIONAR_USUARIOS'),
(27,'REPORTE_INVENTARIO'),
(26,'REPORTE_PRODUCTOS'),
(29,'REPORTE_USUARIOS'),
(28,'REPORTE_VENTAS'),
(9,'VER_CATEGORIAS'),
(19,'VER_CLIENTES'),
(25,'VER_DASHBOARD_ADMIN'),
(14,'VER_INVENTARIO'),
(16,'VER_LOGISTICA'),
(2,'VER_PEDIDOS'),
(5,'VER_PRODUCTOS'),
(20,'VER_PROMOCIONES'),
(22,'VER_RECLAMOS'),
(12,'VER_RESENAS');

-- ========================================================================
-- 3) ROL_PERMISO (Asignación de permisos por rol)
-- ========================================================================
-- ADMIN (rol_id=1): 29 permisos (acceso total)
-- GESTOR_LOGISTICA (rol_id=2): 6 permisos
-- GESTOR_PRODUCTOS (rol_id=3): 10 permisos  
-- GESTOR_COMERCIAL (rol_id=4): 8 permisos
INSERT INTO `rol_permiso` VALUES 
(1,1),(3,1),
(1,2),(4,2),
(1,3),(2,3),
(1,4),
(1,5),(3,5),
(1,6),(3,6),
(1,7),(3,7),
(1,8),(3,8),
(1,9),(3,9),
(1,10),(3,10),
(1,11),(3,11),
(1,12),(3,12),
(1,13),(3,13),
(1,14),(2,14),
(1,15),(2,15),
(1,16),(2,16),
(1,17),(2,17),
(1,18),(4,18),
(1,19),(4,19),
(1,20),(4,20),
(1,21),(4,21),
(1,22),(4,22),
(1,23),(4,23),
(1,24),
(1,25),
(1,26),(3,26),
(1,27),(2,27),
(1,28),(4,28),
(1,29);

-- ========================================================================
-- 4) USUARIOS_ADMIN (4 usuarios del sistema)
-- ========================================================================
-- IMPORTANTE: Contraseña original para todos: (desconocida, usar hash existente)
-- Hash BCrypt: $2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO
INSERT INTO `usuarios_admin` VALUES 
(1, 1, 'Admin', 'Macrosur', 'admin@macrosur.com', '$2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO', 1, '2025-10-14 04:04:38'),
(2, 2, 'Carlos', 'Logistics', 'carlos.logistics@macrosur.com', '$2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO', 1, '2025-10-14 04:04:38'),
(3, 3, 'Maria', 'Products', 'maria.products@macrosur.com', '$2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO', 1, '2025-10-14 04:04:38'),
(4, 4, 'Juan', 'Sales', 'juan.sales@macrosur.com', '$2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO', 1, '2025-10-14 04:04:38');

-- ========================================================================
-- VERIFICACIÓN
-- ========================================================================
SELECT 'Roles insertados:' as '', COUNT(*) as cantidad FROM roles;
SELECT 'Permisos insertados:' as '', COUNT(*) as cantidad FROM permisos;
SELECT 'Relaciones rol-permiso:' as '', COUNT(*) as cantidad FROM rol_permiso;
SELECT 'Usuarios admin:' as '', COUNT(*) as cantidad FROM usuarios_admin;

-- Verificar permisos por rol
SELECT r.nombre_rol, COUNT(rp.permiso_id) as total_permisos
FROM roles r
LEFT JOIN rol_permiso rp ON r.rol_id = rp.rol_id
GROUP BY r.rol_id, r.nombre_rol
ORDER BY r.rol_id;
