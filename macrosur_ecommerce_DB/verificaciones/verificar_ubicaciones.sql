-- Verificar ubicaciones de inventario
SELECT 
    ubicacion_id,
    nombre_ubicacion,
    es_fisica,
    direccion_fisica,
    proveedor_id,
    CASE 
        WHEN es_fisica = 1 THEN 'FÍSICA (Tienda)'
        ELSE 'VIRTUAL (Almacén)'
    END as tipo_descripcion
FROM ubicaciones_inventario
ORDER BY es_fisica DESC;
