-- =============================================
-- VERIFICACIÓN COMPLETA DE PERMISOS Y LOGÍSTICA
-- =============================================

USE macrosur_ecommerce;

-- 1. Verificar migraciones de Flyway
SELECT '=== MIGRACIONES FLYWAY ===' AS '';
SELECT 
    installed_rank,
    version,
    description,
    success,
    installed_on
FROM flyway_schema_history 
WHERE version IN ('7', '8')
ORDER BY installed_rank;

-- 2. Verificar permisos de logística
SELECT '=== PERMISOS DE LOGÍSTICA ===' AS '';
SELECT permiso_id, nombre_permiso 
FROM permisos 
WHERE nombre_permiso IN (
    'GESTIONAR_INVENTARIO',
    'GESTIONAR_ORDENES_REPOSICION',
    'AUTORIZAR_ORDENES_REPOSICION',
    'GESTIONAR_SEGUIMIENTO_DESPACHO',
    'VER_ALARMAS_STOCK',
    'GESTIONAR_PROVEEDORES',
    'GESTIONAR_OPERADORES_LOGISTICOS'
);

-- 3. Verificar roles
SELECT '=== ROLES EXISTENTES ===' AS '';
SELECT rol_id, nombre_rol FROM roles;

-- 4. Verificar permisos del rol Admin
SELECT '=== PERMISOS DEL ROL ADMIN ===' AS '';
SELECT 
    r.nombre_rol,
    p.nombre_permiso
FROM roles r
JOIN rol_permiso rp ON r.rol_id = rp.rol_id
JOIN permisos p ON rp.permiso_id = p.permiso_id
WHERE r.nombre_rol = 'Admin'
ORDER BY p.nombre_permiso;

-- 5. Verificar permisos del rol Gestor Logística
SELECT '=== PERMISOS DEL ROL GESTOR LOGÍSTICA ===' AS '';
SELECT 
    r.nombre_rol,
    p.nombre_permiso
FROM roles r
JOIN rol_permiso rp ON r.rol_id = rp.rol_id
JOIN permisos p ON rp.permiso_id = p.permiso_id
WHERE r.nombre_rol = 'Gestor Logística'
ORDER BY p.nombre_permiso;

-- 6. Verificar tablas de logística
SELECT '=== TABLAS DE LOGÍSTICA ===' AS '';
SELECT 
    TABLE_NAME,
    TABLE_ROWS
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'macrosur_ecommerce'
AND TABLE_NAME IN (
    'proveedores',
    'ubicaciones_inventario',
    'inventario',
    'movimientos_stock',
    'alarmas_stock',
    'ordenes_reposicion',
    'detalles_orden_reposicion',
    'seguimientos_despacho',
    'operadores_logisticos'
);

-- 7. Verificar variantes vs inventario
SELECT '=== VARIANTES VS INVENTARIO ===' AS '';
SELECT 
    (SELECT COUNT(*) FROM variantes_producto) as total_variantes,
    (SELECT COUNT(DISTINCT variante_id) FROM inventario) as variantes_con_inventario,
    (SELECT COUNT(*) FROM variantes_producto) - (SELECT COUNT(DISTINCT variante_id) FROM inventario) as variantes_sin_inventario;

-- 8. Verificar proveedores y ubicaciones
SELECT '=== PROVEEDORES ===' AS '';
SELECT * FROM proveedores;

SELECT '=== UBICACIONES ===' AS '';
SELECT * FROM ubicaciones_inventario;

SELECT '=== OPERADORES LOGÍSTICOS ===' AS '';
SELECT * FROM operadores_logisticos;
