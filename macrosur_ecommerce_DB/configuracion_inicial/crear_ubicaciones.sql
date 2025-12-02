-- Crear ubicaciones de inventario requeridas por el sistema
-- El sistema necesita:
-- 1. Una ubicación física (es_fisica=1) para Tienda
-- 2. Una ubicación virtual (es_fisica=0) para Almacén

INSERT INTO ubicaciones_inventario (nombre_ubicacion, tipo_ubicacion, es_fisica, direccion)
VALUES 
    ('Tienda Física MacroSur', 'TIENDA_FISICA', 1, 'Av. Principal 123, Lima, Perú'),
    ('Almacén Central', 'ALMACEN_CENTRAL', 0, 'Zona Industrial Norte, Callao, Perú');

-- Verificar ubicaciones creadas
SELECT 
    ubicacion_id,
    nombre_ubicacion,
    tipo_ubicacion,
    es_fisica,
    CASE 
        WHEN es_fisica = 1 THEN 'FÍSICA (Tienda)'
        ELSE 'VIRTUAL (Almacén)'
    END as tipo_descripcion
FROM ubicaciones_inventario
ORDER BY es_fisica DESC;
