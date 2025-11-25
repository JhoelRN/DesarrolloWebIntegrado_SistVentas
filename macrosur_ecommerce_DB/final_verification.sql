USE macrosur_ecommerce;

-- =====================================================
-- VERIFICACIÓN FINAL DEL SISTEMA COMPLETO
-- =====================================================

SELECT '============================================' as separador;
SELECT 'VERIFICACIÓN FINAL DEL SISTEMA DE REPORTES' as titulo;
SELECT '============================================' as separador;

-- VERIFICAR ESTRUCTURA DE SEGURIDAD
SELECT 'ROLES Y PERMISOS:' as seccion;
SELECT r.nombre_rol, COUNT(rp.permiso_id) as permisos_total
FROM Roles r
LEFT JOIN Rol_Permiso rp ON r.rol_id = rp.rol_id
GROUP BY r.rol_id, r.nombre_rol
ORDER BY r.rol_id;

SELECT 'USUARIOS ADMINISTRATIVOS:' as seccion;
SELECT ua.nombre, ua.apellido, ua.correo_corporativo, r.nombre_rol, ua.activo
FROM Usuarios_Admin ua
LEFT JOIN Roles r ON ua.rol_id = r.rol_id
ORDER BY ua.usuario_admin_id;

-- VERIFICAR DATOS PARA REPORTES
SELECT 'DATOS PARA REPORTE DE PRODUCTOS:' as seccion;
SELECT p.codigo_producto, p.nombre_producto, c.nombre AS categoria, 
       p.precio_unitario, SUM(COALESCE(vi.stock_actual,0)) as stock_total
FROM Productos p
LEFT JOIN Producto_Categoria pc ON p.producto_id = pc.producto_id
LEFT JOIN Categorias c ON pc.categoria_id = c.categoria_id
LEFT JOIN Vista_Inventario vi ON p.producto_id = vi.producto_id
GROUP BY p.producto_id, p.codigo_producto, p.nombre_producto, c.nombre, p.precio_unitario
ORDER BY p.codigo_producto
LIMIT 5;

SELECT 'DATOS PARA REPORTE DE INVENTARIO:' as seccion;
SELECT producto, stock_actual, stock_minimo, ubicacion
FROM Vista_Inventario 
WHERE stock_actual > 0
ORDER BY producto
LIMIT 5;

SELECT 'DATOS PARA REPORTE DE VENTAS:' as seccion;
SELECT fecha, cliente_nombre, productos_descripcion, total, estado
FROM Vista_Ventas
ORDER BY fecha DESC
LIMIT 5;

SELECT 'DATOS PARA REPORTE DE USUARIOS:' as seccion;
SELECT ua.nombre, ua.apellido, ua.correo_corporativo, r.nombre_rol, 
       ua.fecha_creacion, ua.activo
FROM Usuarios_Admin ua
LEFT JOIN Roles r ON ua.rol_id = r.rol_id
ORDER BY ua.fecha_creacion DESC;

-- VERIFICAR PERMISOS ESPECÍFICOS DE REPORTES
SELECT 'PERMISOS DE REPORTES POR ROL:' as seccion;
SELECT r.nombre_rol, p.nombre_permiso
FROM Roles r
JOIN Rol_Permiso rp ON r.rol_id = rp.rol_id
JOIN Permisos p ON rp.permiso_id = p.permiso_id
WHERE p.nombre_permiso LIKE 'REPORTE_%'
ORDER BY r.rol_id, p.nombre_permiso;

-- RESUMEN FINAL
SELECT 'RESUMEN FINAL:' as seccion;
SELECT 'Total Roles' as concepto, COUNT(*) as cantidad FROM Roles
UNION ALL
SELECT 'Total Permisos' as concepto, COUNT(*) as cantidad FROM Permisos
UNION ALL  
SELECT 'Total Usuarios Admin' as concepto, COUNT(*) as cantidad FROM Usuarios_Admin
UNION ALL
SELECT 'Total Productos' as concepto, COUNT(*) as cantidad FROM Productos
UNION ALL
SELECT 'Total Pedidos' as concepto, COUNT(*) as cantidad FROM Pedidos
UNION ALL
SELECT 'Productos con Stock' as concepto, COUNT(DISTINCT producto_id) as cantidad 
FROM Vista_Inventario WHERE stock_actual > 0
UNION ALL
SELECT 'Ventas Registradas' as concepto, COUNT(*) as cantidad FROM Vista_Ventas;

SELECT '============================================' as separador;
SELECT '✅ SISTEMA COMPLETAMENTE LISTO PARA TESTING' as resultado;
SELECT '============================================' as separador;

-- CREDENCIALES DE ACCESO
SELECT 'CREDENCIALES DE ACCESO:' as info;
SELECT 'admin@macrosur.com / admin123 (ADMIN - todos los reportes)' as credencial
UNION ALL
SELECT 'carlos.logistics@macrosur.com / logistica123 (LOGÍSTICA - reporte inventario)' as credencial
UNION ALL  
SELECT 'maria.products@macrosur.com / productos123 (PRODUCTOS - reporte productos)' as credencial
UNION ALL
SELECT 'juan.sales@macrosur.com / comercial123 (COMERCIAL - reporte ventas)' as credencial;