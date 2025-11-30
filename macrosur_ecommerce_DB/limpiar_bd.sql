-- ====================================================
-- SCRIPT: Limpieza y preparación de base de datos
-- ====================================================

-- 1. Eliminar ubicaciones duplicadas (dejar solo ID 1)
DELETE FROM ubicaciones_inventario WHERE ubicacion_id = 2;

-- 2. Actualizar ubicación principal
UPDATE ubicaciones_inventario 
SET nombre_ubicacion = 'Tienda Física Macrosur',
    tipo_ubicacion = 'TIENDA',
    direccion = 'Av. Principal 123, Santiago Centro',
    es_fisica = TRUE
WHERE ubicacion_id = 1;

-- 3. Crear Almacén Central
INSERT INTO ubicaciones_inventario (nombre_ubicacion, tipo_ubicacion, direccion, es_fisica, proveedor_id)
VALUES ('Almacén Central', 'ALMACEN', 'Bodega Central, Ruta 5 Sur Km 12', TRUE, NULL);

-- 4. Eliminar operadores logísticos duplicados (dejar solo los primeros)
DELETE FROM operadores_logisticos WHERE operador_id > 4;

-- 5. Actualizar nombres de operadores principales
UPDATE operadores_logisticos SET nombre = 'Chilexpress' WHERE operador_id = 1;
UPDATE operadores_logisticos SET nombre = 'Correos de Chile' WHERE operador_id = 2;

-- 6. Eliminar proveedores duplicados (dejar solo únicos)
DELETE FROM proveedores WHERE proveedor_id IN (9, 10, 11, 12, 13);

-- 7. Verificar estado final
SELECT '=== UBICACIONES LIMPIAS ===' AS '';
SELECT * FROM ubicaciones_inventario;

SELECT '' AS '';
SELECT '=== OPERADORES LIMPIOS ===' AS '';
SELECT * FROM operadores_logisticos;

SELECT '' AS '';
SELECT '=== PROVEEDORES LIMPIOS ===' AS '';
SELECT proveedor_id, nombre, contacto FROM proveedores;
