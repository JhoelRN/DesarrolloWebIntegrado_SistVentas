-- Ver todos los registros de Flyway
USE macrosur_ecommerce;

SELECT 
    installed_rank,
    version,
    description,
    success,
    checksum,
    installed_on
FROM flyway_schema_history 
ORDER BY installed_rank DESC;
