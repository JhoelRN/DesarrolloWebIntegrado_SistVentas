-- Ver todas las promociones y su estado
SELECT 
    regla_id, 
    nombre_regla, 
    tipo_descuento,
    valor_descuento,
    activa, 
    DATE_FORMAT(fecha_inicio, '%Y-%m-%d') as inicio,
    DATE_FORMAT(fecha_fin, '%Y-%m-%d') as fin,
    CASE 
        WHEN fecha_fin < CURDATE() THEN 'VENCIDA'
        WHEN fecha_inicio > CURDATE() THEN 'FUTURA'
        WHEN activa = 1 THEN 'ACTIVA'
        ELSE 'INACTIVA'
    END as estado
FROM reglas_descuento
ORDER BY regla_id;
