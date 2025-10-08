use macrosur_ecommerce;
-- 4. INVENTARIO Y LOGÍSTICA
CREATE TABLE Proveedores (
    proveedor_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    contacto VARCHAR(150),
    telefono VARCHAR(20)
);

CREATE TABLE Operadores_Logisticos (
    operador_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(150) NOT NULL,
    url_rastreo_base VARCHAR(255) NOT NULL -- Base URL para redirigir el rastreo (Ej: https://dhl.com/track?id=)
);

CREATE TABLE Ubicaciones_Inventario (
    ubicacion_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_ubicacion VARCHAR(100) NOT NULL, -- Ej: Tienda Central, Almacén Proveedor A
    es_fisica BOOLEAN NOT NULL DEFAULT TRUE, -- TRUE para tiendas/almacenes propios, FALSE para almacenes virtuales de proveedores
    direccion_fisica TEXT,
    proveedor_id INT, -- NULL si es ubicación propia, FK si es almacén de proveedor
    FOREIGN KEY (proveedor_id) REFERENCES Proveedores(proveedor_id)
);

CREATE TABLE Inventario (
    inventario_id INT PRIMARY KEY AUTO_INCREMENT,
    variante_id INT NOT NULL,
    ubicacion_id INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 0,
    stock_minimo_seguridad INT DEFAULT 0, -- Para disparar alarmas de reposición en stock físico
    UNIQUE (variante_id, ubicacion_id), -- Un producto solo puede tener un stock por ubicación
    FOREIGN KEY (variante_id) REFERENCES Variantes_Producto(variante_id),
    FOREIGN KEY (ubicacion_id) REFERENCES Ubicaciones_Inventario(ubicacion_id)
);

CREATE TABLE Movimientos_Stock (
    movimiento_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    variante_id INT NOT NULL,
    ubicacion_origen_id INT,
    ubicacion_destino_id INT,
    cantidad_movida INT NOT NULL,
    tipo_movimiento ENUM('Salida Venta', 'Entrada Compra', 'Ajuste', 'Transferencia') NOT NULL,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pedido_id BIGINT,
    FOREIGN KEY (variante_id) REFERENCES Variantes_Producto(variante_id),
    FOREIGN KEY (ubicacion_origen_id) REFERENCES Ubicaciones_Inventario(ubicacion_id),
    FOREIGN KEY (ubicacion_destino_id) REFERENCES Ubicaciones_Inventario(ubicacion_id)
);

CREATE TABLE Alarmas_Stock (
    alarma_id INT PRIMARY KEY AUTO_INCREMENT,
    variante_id INT NOT NULL,
    ubicacion_id INT NOT NULL,
    tipo_alarma ENUM('Bajo Stock', 'Stock Cero', 'Venta Consignada') NOT NULL,
    fecha_alarma TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resuelto BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (variante_id) REFERENCES Variantes_Producto(variante_id),
    FOREIGN KEY (ubicacion_id) REFERENCES Ubicaciones_Inventario(ubicacion_id)
);

CREATE TABLE Ordenes_Reposicion (
    orden_reposicion_id INT PRIMARY KEY AUTO_INCREMENT,
    proveedor_id INT NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_autorizacion TIMESTAMP,
    usuario_admin_id_autoriza INT,
    estado_autorizacion ENUM('Pendiente', 'Autorizada', 'Rechazada') DEFAULT 'Pendiente',
    costo_total DECIMAL(10, 2), -- Costo de compra para MACROSUR (para futuros reportes)
    FOREIGN KEY (proveedor_id) REFERENCES Proveedores(proveedor_id),
    FOREIGN KEY (usuario_admin_id_autoriza) REFERENCES Usuarios_Admin(usuario_admin_id)
);

CREATE TABLE Detalle_Orden_Reposicion (
    detalle_orden_id INT PRIMARY KEY AUTO_INCREMENT,
    orden_reposicion_id INT NOT NULL,
    variante_id INT NOT NULL,
    cantidad_pedida INT NOT NULL,
    costo_unitario DECIMAL(10, 2),
    FOREIGN KEY (orden_reposicion_id) REFERENCES Ordenes_Reposicion(orden_reposicion_id),
    FOREIGN KEY (variante_id) REFERENCES Variantes_Producto(variante_id)
);