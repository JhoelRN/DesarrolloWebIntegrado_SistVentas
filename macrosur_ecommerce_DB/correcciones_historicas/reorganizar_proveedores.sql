-- ===================================================================
-- REORGANIZACIÓN DE PROVEEDORES
-- Objetivo: Tener 3 proveedores especializados por categoría
-- ===================================================================

-- 1. Eliminar duplicados
DELETE FROM proveedores WHERE proveedor_id = 14; -- Decoraciones Modernas duplicado
DELETE FROM proveedores WHERE proveedor_id = 5;  -- Proveedor Principal duplicado

-- 2. Actualizar proveedores existentes con nombres descriptivos
UPDATE proveedores 
SET nombre = 'Textiles y Alfombras Premium',
    contacto = 'Juan Pérez - Gerente de Ventas',
    telefono = '+51 987654321'
WHERE proveedor_id = 6;

UPDATE proveedores 
SET nombre = 'Muebles y Decoración Hogar',
    contacto = 'María González - Atención al Cliente',
    telefono = '+51 987654322'
WHERE proveedor_id = 7;

UPDATE proveedores 
SET nombre = 'Cocina y Menaje del Hogar',
    contacto = 'Carlos Rodríguez - Ventas',
    telefono = '+51 987654323'
WHERE proveedor_id = 8;

-- 3. Actualizar el proveedor por defecto (ID=1)
UPDATE proveedores 
SET nombre = 'Proveedor General (Por Defecto)',
    contacto = 'Ventas Generales',
    telefono = '+51 987654320'
WHERE proveedor_id = 1;

-- 4. Verificar proveedores finales
SELECT 
    proveedor_id,
    nombre,
    contacto,
    telefono,
    CASE 
        WHEN proveedor_id = 1 THEN '⚙️ Por defecto (sistema)'
        WHEN proveedor_id = 6 THEN '🏠 Alfombras, Tapetes, Cojines, Cortinas'
        WHEN proveedor_id = 7 THEN '🪑 Muebles, Cuadros, Espejos'
        WHEN proveedor_id = 8 THEN '🍽️ Cocina, Vajilla, Utensilios'
        ELSE '❓ Sin clasificar'
    END as especialidad
FROM proveedores
ORDER BY proveedor_id;

-- 5. Resumen de productos sin proveedor asignado (para órdenes automáticas)
SELECT 
    '⚠️ IMPORTANTE' as nota,
    'El sistema asignará automáticamente proveedores según historial de órdenes' as funcionamiento,
    'Si no hay historial, usará Proveedor ID=1 por defecto' as fallback,
    'Puedes cambiar manualmente el proveedor al crear cada orden' as manual;

SELECT '✅ Reorganización completada - 4 proveedores activos' as resultado;
