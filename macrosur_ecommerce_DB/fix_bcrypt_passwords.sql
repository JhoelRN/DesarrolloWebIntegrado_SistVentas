-- ================== NUEVO HASH BCRYPT CORRECTO ================== 
-- Generar hash correcto para 123456

-- Usar el hash BCrypt CORRECTO generado por nuestro sistema para "123456"
-- Hash generado: $2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO

UPDATE Usuarios_Admin SET contrasena_hash = '$2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO' WHERE correo_corporativo = 'admin@macrosur.com';
UPDATE Usuarios_Admin SET contrasena_hash = '$2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO' WHERE correo_corporativo = 'carlos.logistics@macrosur.com';
UPDATE Usuarios_Admin SET contrasena_hash = '$2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO' WHERE correo_corporativo = 'maria.products@macrosur.com';
UPDATE Usuarios_Admin SET contrasena_hash = '$2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO' WHERE correo_corporativo = 'juan.sales@macrosur.com';

-- Verificar
SELECT usuario_admin_id, nombre, correo_corporativo, LEFT(contrasena_hash, 20) as password_preview 
FROM Usuarios_Admin;