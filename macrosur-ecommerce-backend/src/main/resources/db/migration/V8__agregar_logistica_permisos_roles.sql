-- Script para agregar permisos y rol de logística
-- Fecha: 2025-11-27
-- Descripción: Agrega permisos para módulo de logística y crea rol "Gestor Logística"

USE macrosur_ecommerce;

-- =============================================
-- 1. AGREGAR PERMISOS DE LOGÍSTICA
-- =============================================

INSERT INTO permisos (nombre_permiso) VALUES
('GESTIONAR_INVENTARIO'),
('GESTIONAR_ORDENES_REPOSICION'),
('AUTORIZAR_ORDENES_REPOSICION'),
('GESTIONAR_SEGUIMIENTO_DESPACHO'),
('VER_ALARMAS_STOCK'),
('GESTIONAR_PROVEEDORES'),
('GESTIONAR_OPERADORES_LOGISTICOS')
ON DUPLICATE KEY UPDATE nombre_permiso = nombre_permiso;

-- =============================================
-- 2. CREAR ROL "GESTOR LOGÍSTICA"
-- =============================================

INSERT INTO roles (nombre_rol) VALUES ('Gestor Logística')
ON DUPLICATE KEY UPDATE nombre_rol = nombre_rol;

-- =============================================
-- 3. ASIGNAR PERMISOS AL ROL "GESTOR LOGÍSTICA"
-- =============================================

-- Obtener ID del rol
SET @rol_logistica_id = (SELECT rol_id FROM roles WHERE nombre_rol = 'Gestor Logística');

-- Asignar permisos
INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT @rol_logistica_id, permiso_id
FROM permisos
WHERE nombre_permiso IN (
    'GESTIONAR_INVENTARIO',
    'GESTIONAR_ORDENES_REPOSICION',
    'GESTIONAR_SEGUIMIENTO_DESPACHO',
    'VER_ALARMAS_STOCK',
    'GESTIONAR_PROVEEDORES',
    'GESTIONAR_OPERADORES_LOGISTICOS'
)
ON DUPLICATE KEY UPDATE rol_id = rol_id;

-- =============================================
-- 4. ASIGNAR PERMISOS ADICIONALES AL ROL "ADMIN"
-- (Para que admin pueda autorizar órdenes)
-- =============================================

SET @rol_admin_id = (SELECT rol_id FROM roles WHERE nombre_rol = 'Admin');

INSERT INTO rol_permiso (rol_id, permiso_id)
SELECT @rol_admin_id, permiso_id
FROM permisos
WHERE nombre_permiso IN (
    'GESTIONAR_INVENTARIO',
    'GESTIONAR_ORDENES_REPOSICION',
    'AUTORIZAR_ORDENES_REPOSICION',
    'GESTIONAR_SEGUIMIENTO_DESPACHO',
    'VER_ALARMAS_STOCK',
    'GESTIONAR_PROVEEDORES',
    'GESTIONAR_OPERADORES_LOGISTICOS'
)
ON DUPLICATE KEY UPDATE rol_id = rol_id;

-- =============================================
-- 5. INSERTAR OPERADORES LOGÍSTICOS (CHILEXPRESS Y CORREOS DE CHILE)
-- =============================================

INSERT INTO operadores_logisticos (nombre, url_rastreo_base) VALUES
('Chilexpress', 'https://www.chilexpress.cl/Seguimiento?='),
('Correos de Chile', 'https://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio=')
ON DUPLICATE KEY UPDATE nombre = nombre;

-- =============================================
-- 6. INSERTAR PROVEEDOR POR DEFECTO (SI NO EXISTE)
-- =============================================

INSERT INTO proveedores (nombre, contacto, telefono) VALUES
('Proveedor Principal', 'contacto@proveedor.cl', '+56912345678')
ON DUPLICATE KEY UPDATE nombre = nombre;

-- =============================================
-- 7. INSERTAR UBICACIÓN DE TIENDA FÍSICA (SI NO EXISTE)
-- =============================================

INSERT INTO ubicaciones_inventario (nombre_ubicacion, tipo_ubicacion, es_fisica, direccion) VALUES
('Tienda Principal', 'TIENDA', TRUE, 'Dirección de la tienda física')
ON DUPLICATE KEY UPDATE nombre_ubicacion = nombre_ubicacion;

-- =============================================
-- VERIFICACIÓN DE RESULTADOS
-- =============================================

SELECT 'Permisos de logística creados:' AS resultado;
SELECT permiso_id, nombre_permiso FROM permisos WHERE nombre_permiso LIKE '%LOGISTIC%' OR nombre_permiso LIKE '%INVENTARIO%' OR nombre_permiso LIKE '%ORDEN%' OR nombre_permiso LIKE '%SEGUIMIENTO%' OR nombre_permiso LIKE '%ALARMA%' OR nombre_permiso LIKE '%PROVEEDOR%' OR nombre_permiso LIKE '%OPERADOR%';

SELECT 'Rol Gestor Logística:' AS resultado;
SELECT r.rol_id, r.nombre_rol, COUNT(rp.permiso_id) AS cantidad_permisos
FROM roles r
LEFT JOIN rol_permiso rp ON r.rol_id = rp.rol_id
WHERE r.nombre_rol = 'Gestor Logística'
GROUP BY r.rol_id, r.nombre_rol;

SELECT 'Operadores logísticos:' AS resultado;
SELECT * FROM operadores_logisticos;

SELECT 'Proveedores:' AS resultado;
SELECT * FROM proveedores;

SELECT 'Ubicaciones:' AS resultado;
SELECT * FROM ubicaciones_inventario;
