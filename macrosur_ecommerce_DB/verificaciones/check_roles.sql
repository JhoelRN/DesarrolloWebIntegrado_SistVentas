-- Script para verificar roles y usuarios en la base de datos
USE macrosur_ecommerce;

-- 1. Ver todos los roles
SELECT '=== ROLES EXISTENTES ===' AS info;
SELECT rol_id, nombre_rol FROM roles ORDER BY rol_id;

-- 2. Ver usuarios admin y sus roles
SELECT '=== USUARIOS Y SUS ROLES ===' AS info;
SELECT 
    ua.usuario_admin_id,
    ua.nombre,
    ua.apellido,
    ua.correo_corporativo,
    r.nombre_rol,
    ua.activo
FROM usuarios_admin ua
LEFT JOIN roles r ON ua.rol_id = r.rol_id
ORDER BY ua.usuario_admin_id;

-- 3. Contar permisos por rol
SELECT '=== PERMISOS POR ROL ===' AS info;
SELECT 
    r.nombre_rol,
    COUNT(rp.permiso_id) as total_permisos
FROM roles r
LEFT JOIN rol_permiso rp ON r.rol_id = rp.rol_id
GROUP BY r.rol_id, r.nombre_rol
ORDER BY r.rol_id;
