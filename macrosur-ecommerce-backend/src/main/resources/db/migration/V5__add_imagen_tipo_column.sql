-- ============================================================
-- Migration V5: Agregar campo imagen_tipo para rastrear origen
-- ============================================================
-- Fecha: 2025-11-26
-- Descripción: Agrega columna opcional para identificar el tipo de imagen
--              (url externa, archivo local, biblioteca online)
-- ============================================================

-- Agregar columna imagen_tipo (opcional para tracking)
ALTER TABLE productos
ADD COLUMN imagen_tipo ENUM('url', 'local', 'unsplash', 'other') DEFAULT 'url'
COMMENT 'Tipo de origen de la imagen: url=externa manual, local=archivo subido, unsplash=biblioteca online';

-- Crear índice para búsquedas por tipo (opcional)
CREATE INDEX idx_productos_imagen_tipo ON productos(imagen_tipo);

-- Actualizar registros existentes según la URL
UPDATE productos
SET imagen_tipo = CASE
    WHEN imagen_url LIKE '/uploads/%' THEN 'local'
    WHEN imagen_url LIKE '%unsplash.com%' THEN 'unsplash'
    WHEN imagen_url LIKE '%placeholder.com%' THEN 'other'
    ELSE 'url'
END
WHERE imagen_url IS NOT NULL;
