-- V2__add_destacado_column_to_productos.sql
-- Agregar columna "destacado" para marcar productos en portada

ALTER TABLE Productos 
ADD COLUMN destacado TINYINT(1) DEFAULT 0 
COMMENT 'Indica si el producto aparece destacado en la página principal';

-- Crear índice para búsquedas rápidas
CREATE INDEX idx_destacado ON Productos(destacado);