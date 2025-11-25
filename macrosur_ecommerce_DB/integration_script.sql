-- =====================================================
-- SCRIPT COMPLETO DE INTEGRACIÓN - EJECUTAR EN ORDEN
-- =====================================================

USE macrosur_ecommerce;

-- PASO 1: Crear todas las tablas (ejecutar todos los archivos SQL de tablas primero)
-- 1. Tablas del Módulo de Seguridad y Administración.sql
-- 2. Tablas del Módulo de Catálogo y Productos.sql  
-- 3. Tablas del Módulo de Clientes y Reseñas.sql
-- 4. Tablas del Módulo de Logística, Inventario y Stock Consignado.sql
-- 5. Tablas del Módulo de Ventas, Promociones y Seguimiento.sql

-- PASO 2: Ejecutar insert_admin.sql (roles, permisos, usuarios)

-- PASO 3: Ejecutar este script de corrección
SOURCE fix_database_for_reports.sql;

-- PASO 4: Verificar que todo esté correcto
SELECT 'VERIFICACIÓN FINAL' as status;

-- Verificar tablas principales
SELECT 'Roles' as tabla, COUNT(*) as registros FROM Roles;
SELECT 'Permisos' as tabla, COUNT(*) as registros FROM Permisos; 
SELECT 'Usuarios_Admin' as tabla, COUNT(*) as registros FROM Usuarios_Admin;
SELECT 'Productos' as tabla, COUNT(*) as registros FROM Productos;
SELECT 'Categorias' as tabla, COUNT(*) as registros FROM Categorias;
SELECT 'Inventario' as tabla, COUNT(*) as registros FROM Inventario;
SELECT 'Pedidos' as tabla, COUNT(*) as registros FROM Pedidos;
SELECT 'Clientes' as tabla, COUNT(*) as registros FROM Clientes;

-- Verificar vistas para reportes
SELECT 'Vista_Inventario' as vista, COUNT(*) as registros FROM Vista_Inventario WHERE stock_actual IS NOT NULL;
SELECT 'Vista_Ventas' as vista, COUNT(*) as registros FROM Vista_Ventas;

-- Verificar permisos por rol
SELECT r.nombre_rol, COUNT(rp.permiso_id) as permisos_asignados
FROM Roles r
LEFT JOIN Rol_Permiso rp ON r.rol_id = rp.rol_id
GROUP BY r.rol_id, r.nombre_rol
ORDER BY r.rol_id;

-- Verificar usuarios con roles
SELECT ua.nombre, ua.apellido, ua.correo_corporativo, r.nombre_rol, ua.activo
FROM Usuarios_Admin ua
LEFT JOIN Roles r ON ua.rol_id = r.rol_id
ORDER BY ua.usuario_admin_id;

-- =====================================================
-- CREDENCIALES DE ACCESO PARA PRUEBAS
-- =====================================================

/*
USUARIOS DE PRUEBA CREADOS:

1. ADMIN COMPLETO:
   Email: admin@macrosur.com
   Password: admin123
   Rol: ADMIN (acceso total)

2. GESTOR DE LOGÍSTICA:
   Email: carlos.logistics@macrosur.com  
   Password: logistica123
   Rol: GESTOR_LOGISTICA (reportes inventario)

3. GESTOR DE PRODUCTOS:
   Email: maria.products@macrosur.com
   Password: productos123
   Rol: GESTOR_PRODUCTOS (reportes productos)

4. GESTOR COMERCIAL:
   Email: juan.sales@macrosur.com
   Password: comercial123
   Rol: GESTOR_COMERCIAL (reportes ventas)

DATOS DE PRUEBA CREADOS:
- 5 productos con códigos, precios y stock
- 4 categorías diferentes
- 3 ubicaciones de inventario
- 3 clientes de prueba
- 5 pedidos con diferentes estados
- Inventario distribuido en múltiples ubicaciones
*/

SELECT 'INTEGRACIÓN COMPLETADA EXITOSAMENTE' as resultado;