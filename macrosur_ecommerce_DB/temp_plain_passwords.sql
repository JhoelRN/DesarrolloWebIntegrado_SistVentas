USE macrosur_ecommerce;

-- MÉTODO TEMPORAL: Usar contraseñas simples para testing
-- Una vez que funcione, las cambiaremos por hashes BCrypt

-- Actualizar con contraseñas simples para verificar funcionalidad
UPDATE Usuarios_Admin SET 
    contrasena_hash = 'admin123'  -- TEMPORAL: texto plano
WHERE correo_corporativo = 'admin@macrosur.com';

UPDATE Usuarios_Admin SET 
    contrasena_hash = 'logistica123'  -- TEMPORAL: texto plano
WHERE correo_corporativo = 'carlos.logistics@macrosur.com';

UPDATE Usuarios_Admin SET 
    contrasena_hash = 'productos123'  -- TEMPORAL: texto plano
WHERE correo_corporativo = 'maria.products@macrosur.com';

UPDATE Usuarios_Admin SET 
    contrasena_hash = 'comercial123'  -- TEMPORAL: texto plano
WHERE correo_corporativo = 'juan.sales@macrosur.com';

-- Verificar los cambios
SELECT correo_corporativo, contrasena_hash, activo 
FROM Usuarios_Admin 
ORDER BY usuario_admin_id;

SELECT 'CONTRASEÑAS TEMPORALES EN TEXTO PLANO - SOLO PARA TESTING' as resultado;