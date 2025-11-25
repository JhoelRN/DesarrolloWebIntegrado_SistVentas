-- Verificar datos para reportes

-- Verificar usuarios (para reporte de usuarios)
SELECT COUNT(*) as total_usuarios FROM Usuarios_Admin;
SELECT * FROM Usuarios_Admin LIMIT 5;

-- Verificar si existen tablas de productos, ventas, etc.
SHOW TABLES LIKE '%producto%';
SHOW TABLES LIKE '%venta%';
SHOW TABLES LIKE '%inventario%';