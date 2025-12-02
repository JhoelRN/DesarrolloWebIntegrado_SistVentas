-- Migración V3: Agregar campo activo a productos y categorías para soft delete
-- Autor: Sistema
-- Fecha: 2025-11-26

-- Agregar campo activo a productos (soft delete)
ALTER TABLE productos ADD COLUMN activo TINYINT(1) DEFAULT 1 NOT NULL COMMENT 'Indica si el producto está activo (1) o eliminado lógicamente (0)';

-- Agregar índice para mejorar consultas de productos activos
CREATE INDEX idx_productos_activo ON productos(activo);

-- Agregar campo activo a categorías (soft delete)
ALTER TABLE categorias ADD COLUMN activo TINYINT(1) DEFAULT 1 NOT NULL COMMENT 'Indica si la categoría está activa (1) o eliminada lógicamente (0)';

-- Agregar índice para mejorar consultas de categorías activas
CREATE INDEX idx_categorias_activo ON categorias(activo);

-- Actualizar todos los registros existentes como activos
UPDATE productos SET activo = 1 WHERE activo IS NULL;
UPDATE categorias SET activo = 1 WHERE activo IS NULL;
