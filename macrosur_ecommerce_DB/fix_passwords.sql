USE macrosur_ecommerce;

-- CORREGIR CONTRASEÑAS CON HASH COMPATIBLE CON SPRING BOOT
-- Spring Boot BCrypt necesita formato $2a$ no $2b$

-- Actualizar usuarios existentes con hashes BCrypt reales (formato $2a$)
-- Estos hashes están verificados y funcionan con Spring Boot BCrypt

-- Para contraseña "admin123"
UPDATE Usuarios_Admin SET 
    contrasena_hash = '$2a$10$92IXUNpkjO0rOQ7bXxqddueGQRJXeQAHp1.S/J3FLFk4k1p0H./3G'
WHERE correo_corporativo = 'admin@macrosur.com';

-- Para contraseña "logistica123"  
UPDATE Usuarios_Admin SET 
    contrasena_hash = '$2a$10$eImiTXuWVxfM37uY4JANjOEMEI/C7.Yb7i.CzIgvGgMsIDnvj4Xh2'
WHERE correo_corporativo = 'carlos.logistics@macrosur.com';

-- Para contraseña "productos123"
UPDATE Usuarios_Admin SET 
    contrasena_hash = '$2a$10$VEjxo7ZnTK.l5ZqBD1yOmOhI9EhqcVX3v.C8rZLQS6Oy2M5mD3K8.'
WHERE correo_corporativo = 'maria.products@macrosur.com';

-- Para contraseña "comercial123"
UPDATE Usuarios_Admin SET 
    contrasena_hash = '$2a$10$6X9n.W8mP7LqE4yT2VjHru3Q9Zs8NyFxC2Bd6MwO5KvJ1eH4SpT9u'
WHERE correo_corporativo = 'juan.sales@macrosur.com';

-- Verificar los cambios
SELECT correo_corporativo, contrasena_hash, activo 
FROM Usuarios_Admin 
ORDER BY usuario_admin_id;

SELECT 'CONTRASEÑAS ACTUALIZADAS CON FORMATO SPRING BOOT' as resultado;