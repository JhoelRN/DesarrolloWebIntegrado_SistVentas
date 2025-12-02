-- Migration V4: Agregar columna imagen_url a tabla productos
-- Autor: Sistema
-- Fecha: 2025-11-26
-- Descripción: Agrega campo para URL de imagen del producto

ALTER TABLE productos 
ADD COLUMN imagen_url VARCHAR(500) NULL 
COMMENT 'URL de la imagen principal del producto';

-- Índice para búsquedas por imagen (opcional)
-- CREATE INDEX idx_productos_imagen ON productos(imagen_url(255));
