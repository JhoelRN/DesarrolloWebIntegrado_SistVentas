use macrosur_ecommerce;
-- 2. CLIENTES Y GESTIÓN DE CUENTA (FRONTEND)
CREATE TABLE Clientes (
    cliente_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena_hash VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Direcciones (
    direccion_id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id BIGINT NOT NULL,
    alias VARCHAR(50), -- Ej: Casa, Oficina
    calle VARCHAR(255) NOT NULL,
    numero VARCHAR(20),
    ciudad VARCHAR(100) NOT NULL,
    departamento VARCHAR(100) NOT NULL,
    codigo_postal VARCHAR(20),
    es_principal BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id)
);

CREATE TABLE Metodos_Pago_Cliente (
    metodo_pago_id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id BIGINT NOT NULL,
    token_pago VARCHAR(255) NOT NULL, -- Tokenización segura de la tarjeta
    ultimos_digitos VARCHAR(4),
    tipo_tarjeta VARCHAR(20), -- Ej: VISA, MasterCard
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id)
);

CREATE TABLE Resenas (
    resena_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cliente_id BIGINT NOT NULL,
    producto_id INT NOT NULL,
    calificacion TINYINT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha_resena TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado_resena ENUM('Pendiente', 'Aprobada', 'Rechazada') DEFAULT 'Pendiente',
    fecha_compra_verificada TIMESTAMP, -- Para verificar que el cliente realmente compró
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id),
    FOREIGN KEY (producto_id) REFERENCES Productos(producto_id) -- Asumiendo Productos ya existe o se crea
);

CREATE TABLE Reclamaciones (
    reclamo_id INT PRIMARY KEY AUTO_INCREMENT,
    cliente_id BIGINT NOT NULL,
    pedido_id BIGINT,
    tipo_documento ENUM('Boleta', 'Factura'),
    numero_documento VARCHAR(50),
    tipo_reclamo ENUM('Producto Defectuoso', 'Servicio', 'Despacho', 'Otros') NOT NULL,
    detalle_reclamo TEXT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Pendiente', 'En Proceso', 'Resuelto') DEFAULT 'Pendiente',
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id)
);