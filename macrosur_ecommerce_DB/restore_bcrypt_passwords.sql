-- ================== CONTRASEÑAS CON BCRYPT ================== 
-- Todas las contraseñas son: 123456
-- Hash BCrypt: $2a$10$8qvVzD2FJNra.nDnJOtJle6KqCDhRVlS4WvkZGjvxr/gE8Ny7E6Se

UPDATE Usuarios_Admin SET contrasena_hash = '$2a$10$8qvVzD2FJNra.nDnJOtJle6KqCDhRVlS4WvkZGjvxr/gE8Ny7E6Se' WHERE correo_corporativo = 'admin@macrosur.com';
UPDATE Usuarios_Admin SET contrasena_hash = '$2a$10$8qvVzD2FJNra.nDnJOtJle6KqCDhRVlS4WvkZGjvxr/gE8Ny7E6Se' WHERE correo_corporativo = 'carlos.logistics@macrosur.com';
UPDATE Usuarios_Admin SET contrasena_hash = '$2a$10$8qvVzD2FJNra.nDnJOtJle6KqCDhRVlS4WvkZGjvxr/gE8Ny7E6Se' WHERE correo_corporativo = 'maria.products@macrosur.com';
UPDATE Usuarios_Admin SET contrasena_hash = '$2a$10$8qvVzD2FJNra.nDnJOtJle6KqCDhRVlS4WvkZGjvxr/gE8Ny7E6Se' WHERE correo_corporativo = 'juan.sales@macrosur.com';

-- Verificar que se actualizaron
SELECT usuario_admin_id, nombre, correo_corporativo, LEFT(contrasena_hash, 20) as password_preview 
FROM Usuarios_Admin;