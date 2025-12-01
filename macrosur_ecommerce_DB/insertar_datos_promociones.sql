-- ============================================================
-- SCRIPT: Insertar datos de prueba para Módulo de Promociones
-- ============================================================
-- Fecha: 2025-12-01
-- Descripción: Crea permisos, asigna al rol Admin y crea promociones de prueba

USE macrosur_ecommerce;

-- ============================================================
-- 1. VERIFICAR/CREAR PERMISOS
-- ============================================================

-- Insertar permisos si no existen
INSERT IGNORE INTO permisos (permiso_id, nombre) VALUES
(20, 'VER_PROMOCIONES'),
(21, 'GESTIONAR_PROMOCIONES');

-- ============================================================
-- 2. ASIGNAR PERMISOS AL ROL ADMINISTRADOR
-- ============================================================

-- Obtener el rol_id del administrador (normalmente es 1)
SET @admin_rol_id = (SELECT rol_id FROM roles WHERE nombre = 'ADMINISTRADOR' LIMIT 1);

-- Asignar permisos al rol admin si no están asignados
INSERT IGNORE INTO rol_permiso (rol_id, permiso_id) VALUES
(@admin_rol_id, 20),  -- VER_PROMOCIONES
(@admin_rol_id, 21);  -- GESTIONAR_PROMOCIONES

-- ============================================================
-- 3. INSERTAR PROMOCIONES DE PRUEBA
-- ============================================================

-- Limpiar promociones existentes (opcional)
-- DELETE FROM reglas_descuento;

-- Black Friday 2025 (Activa ahora)
INSERT INTO reglas_descuento 
(nombre_regla, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, acumulable, exclusivo, fecha_creacion, fecha_actualizacion)
VALUES
('Black Friday 2025', 'Porcentaje', 30.00, 
 DATE_SUB(NOW(), INTERVAL 1 DAY), 
 DATE_ADD(NOW(), INTERVAL 7 DAY), 
 true, false, NOW(), NOW());

-- Cyber Monday (Activa ahora)
INSERT INTO reglas_descuento 
(nombre_regla, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, acumulable, exclusivo, fecha_creacion, fecha_actualizacion)
VALUES
('Cyber Monday 50%', 'Porcentaje', 50.00, 
 DATE_SUB(NOW(), INTERVAL 1 DAY), 
 DATE_ADD(NOW(), INTERVAL 5 DAY), 
 false, true, NOW(), NOW());

-- Descuento Monto Fijo (Activa)
INSERT INTO reglas_descuento 
(nombre_regla, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, acumulable, exclusivo, fecha_creacion, fecha_actualizacion)
VALUES
('Descuento $50 en compras', 'Monto Fijo', 50.00, 
 DATE_SUB(NOW(), INTERVAL 2 DAY), 
 DATE_ADD(NOW(), INTERVAL 30 DAY), 
 true, false, NOW(), NOW());

-- Promoción 2x1 (Activa)
INSERT INTO reglas_descuento 
(nombre_regla, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, acumulable, exclusivo, fecha_creacion, fecha_actualizacion)
VALUES
('2x1 en productos seleccionados', '2x1', 0.00, 
 DATE_SUB(NOW(), INTERVAL 1 DAY), 
 DATE_ADD(NOW(), INTERVAL 15 DAY), 
 false, false, NOW(), NOW());

-- Envío Gratis (Activa)
INSERT INTO reglas_descuento 
(nombre_regla, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, acumulable, exclusivo, fecha_creacion, fecha_actualizacion)
VALUES
('Envío Gratis en todas las compras', 'Envio Gratis', 0.00, 
 DATE_SUB(NOW(), INTERVAL 3 DAY), 
 DATE_ADD(NOW(), INTERVAL 60 DAY), 
 true, false, NOW(), NOW());

-- Promoción Programada (Futura)
INSERT INTO reglas_descuento 
(nombre_regla, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, acumulable, exclusivo, fecha_creacion, fecha_actualizacion)
VALUES
('Navidad 2025 - 40% OFF', 'Porcentaje', 40.00, 
 DATE_ADD(NOW(), INTERVAL 5 DAY), 
 DATE_ADD(NOW(), INTERVAL 20 DAY), 
 true, false, NOW(), NOW());

-- Promoción Expirada
INSERT INTO reglas_descuento 
(nombre_regla, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, acumulable, exclusivo, fecha_creacion, fecha_actualizacion)
VALUES
('Halloween 2025 (Expirada)', 'Porcentaje', 25.00, 
 DATE_SUB(NOW(), INTERVAL 30 DAY), 
 DATE_SUB(NOW(), INTERVAL 1 DAY), 
 false, false, NOW(), NOW());

-- Promoción Sin Fechas (Permanente)
INSERT INTO reglas_descuento 
(nombre_regla, tipo_descuento, valor_descuento, fecha_inicio, fecha_fin, acumulable, exclusivo, fecha_creacion, fecha_actualizacion)
VALUES
('Descuento Permanente Clientes VIP', 'Porcentaje', 15.00, 
 NULL, NULL, 
 true, false, NOW(), NOW());

-- ============================================================
-- 4. VERIFICACIÓN
-- ============================================================

-- Ver permisos del rol admin
SELECT 
    r.nombre AS 'Rol',
    p.nombre AS 'Permiso'
FROM roles r
INNER JOIN rol_permiso rp ON r.rol_id = rp.rol_id
INNER JOIN permisos p ON rp.permiso_id = p.permiso_id
WHERE r.nombre = 'ADMINISTRADOR' AND p.nombre LIKE '%PROMOCIONES%';

-- Ver promociones insertadas
SELECT 
    regla_id,
    nombre_regla,
    tipo_descuento,
    valor_descuento,
    CASE
        WHEN fecha_inicio IS NULL AND fecha_fin IS NULL THEN 'Permanente'
        WHEN fecha_inicio > NOW() THEN 'Programada'
        WHEN fecha_fin < NOW() THEN 'Expirada'
        ELSE 'Activa'
    END AS estado,
    DATE_FORMAT(fecha_inicio, '%d/%m/%Y') AS inicio,
    DATE_FORMAT(fecha_fin, '%d/%m/%Y') AS fin
FROM reglas_descuento
ORDER BY regla_id DESC;

-- Contar promociones por estado
SELECT 
    CASE
        WHEN fecha_inicio IS NULL AND fecha_fin IS NULL THEN 'Permanente'
        WHEN fecha_inicio > NOW() THEN 'Programada'
        WHEN fecha_fin < NOW() THEN 'Expirada'
        ELSE 'Activa'
    END AS estado,
    COUNT(*) AS cantidad
FROM reglas_descuento
GROUP BY estado;

SELECT '✓ Datos de promociones insertados exitosamente' AS resultado;
