-- Actualizar nombres de operadores existentes para coincidir con frontend
UPDATE operadores_logisticos SET nombre = 'chilexpress' WHERE nombre = 'Chilexpress';
UPDATE operadores_logisticos SET nombre = 'correos_chile' WHERE nombre = 'Correos de Chile';

-- Eliminar duplicados (mantener solo ID 1 y 2)
DELETE FROM operadores_logisticos WHERE operador_id IN (3, 4);

-- Insertar operadores faltantes
INSERT INTO operadores_logisticos (nombre, url_rastreo_base) VALUES
('starken', 'https://www.starken.cl/seguimiento?codigo='),
('bluexpress', 'https://www.bluex.cl/seguimiento?numero='),
('otro', 'https://ejemplo.com/seguimiento?numero=');

-- Ver resultado final
SELECT * FROM operadores_logisticos ORDER BY operador_id;
