-- Ver operadores logísticos (sin filtro activo)
SELECT '=== OPERADORES LOGÍSTICOS ===' AS '';
SELECT * FROM operadores_logisticos;

-- Ver proveedores
SELECT '' AS '';
SELECT '=== PROVEEDORES ===' AS '';
SELECT proveedor_id, nombre, contacto, telefono FROM proveedores LIMIT 10;

-- Ver migraciones Flyway
SELECT '' AS '';
SELECT '=== MIGRACIONES FLYWAY EJECUTADAS ===' AS '';
SELECT version, description, installed_on, success 
FROM flyway_schema_history 
ORDER BY installed_rank DESC;

-- Ver estructura seguimientos_despacho logística
SELECT '' AS '';
SELECT '=== ESTRUCTURA SEGUIMIENTOS_DESPACHO (LOGÍSTICA) ===' AS '';
DESCRIBE seguimientos_despacho;
