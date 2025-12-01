-- Reparar el estado fallido de Flyway para V7
-- Ejecuta este script en MySQL Workbench o tu cliente MySQL

USE macrosur_ecommerce;

-- Desactivar modo seguro temporalmente
SET SQL_SAFE_UPDATES = 0;

-- Ver el estado actual de Flyway
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;

-- Eliminar TODOS los registros de V7 y V8 (sin importar success)
DELETE FROM flyway_schema_history WHERE version IN ('7', '8');

-- Reactivar modo seguro
SET SQL_SAFE_UPDATES = 1;

-- Verificar que se eliminaron
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 5;
