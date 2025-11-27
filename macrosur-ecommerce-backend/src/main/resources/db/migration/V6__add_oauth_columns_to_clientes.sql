-- Agregar columnas para soporte OAuth2 (Google, Microsoft) en tabla clientes
-- Permite login híbrido: manual (con contraseña) y OAuth (sin contraseña)

ALTER TABLE clientes
ADD COLUMN oauth_provider VARCHAR(50) NULL COMMENT 'Proveedor OAuth: google, microsoft, null para manual',
ADD COLUMN oauth_id VARCHAR(255) NULL COMMENT 'ID único del usuario en el proveedor OAuth',
ADD COLUMN avatar_url VARCHAR(500) NULL COMMENT 'URL de la imagen de perfil del usuario';

-- Índice para búsquedas por OAuth
CREATE INDEX idx_clientes_oauth ON clientes(oauth_provider, oauth_id);

-- Modificar contraseña_hash para permitir NULL (usuarios OAuth no tienen contraseña)
ALTER TABLE clientes
MODIFY COLUMN contrasena_hash VARCHAR(255) NULL COMMENT 'Hash de contraseña (NULL para usuarios OAuth)';

-- Comentarios para documentación
ALTER TABLE clientes 
COMMENT = 'Tabla de clientes con soporte para registro manual y OAuth2 (Google, Microsoft)';
