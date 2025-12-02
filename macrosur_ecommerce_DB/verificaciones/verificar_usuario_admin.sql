-- Verificar si existe usuario admin y crear uno si no existe
USE macrosur_ecommerce;

-- Ver usuarios existentes
SELECT 
    usuario_admin_id,
    rol_id,
    nombre,
    apellido,
    correo_corporativo,
    activo
FROM usuarios_admin;

-- Crear usuario admin si no existe
-- Password: admin123 (hash BCrypt generado)
INSERT INTO usuarios_admin (rol_id, nombre, apellido, correo_corporativo, contrasena_hash, activo)
SELECT 1, 'Admin', 'Sistema', 'admin@macrosur.com', 
       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', TRUE
WHERE NOT EXISTS (
    SELECT 1 FROM usuarios_admin WHERE correo_corporativo = 'admin@macrosur.com'
);

-- Verificar resultado
SELECT 
    usuario_admin_id,
    rol_id,
    nombre,
    correo_corporativo,
    activo
FROM usuarios_admin
WHERE correo_corporativo = 'admin@macrosur.com';
