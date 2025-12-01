-- =====================================================================
-- Script: Asegurar Ubicación Principal para Inventario Automático
-- Descripción: Inserta 'Tienda Principal' si no existe
-- Fecha: 2025-11-27
-- Propósito: Preparar base de datos para creación automática de inventario
-- =====================================================================

USE macrosur_ecommerce;

-- Insertar ubicación principal si no existe
INSERT INTO ubicaciones_inventario (nombre_ubicacion, tipo_ubicacion, direccion, es_fisica, proveedor_id)
SELECT 'Tienda Principal', 'TIENDA', 'Av. Principal 123, Santiago, Chile', TRUE, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM ubicaciones_inventario 
    WHERE nombre_ubicacion = 'Tienda Principal'
);

-- Verificar ubicaciones existentes
SELECT 
    ubicacion_id,
    nombre_ubicacion,
    tipo_ubicacion,
    direccion,
    es_fisica,
    proveedor_id
FROM ubicaciones_inventario
ORDER BY es_fisica DESC, nombre_ubicacion;
