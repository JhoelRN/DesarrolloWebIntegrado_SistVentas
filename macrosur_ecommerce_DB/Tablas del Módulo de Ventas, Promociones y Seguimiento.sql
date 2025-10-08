use macrosur_ecommerce;
-- 5. VENTAS Y TRANSACCIONES
CREATE TABLE Reglas_Descuento (
    regla_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_regla VARCHAR(100) NOT NULL,
    tipo_descuento ENUM('Porcentaje', 'Monto Fijo', '2x1', 'Envio Gratis') NOT NULL,
    valor_descuento DECIMAL(10, 2) NOT NULL,
    acumulable BOOLEAN DEFAULT TRUE,
    exclusivo BOOLEAN DEFAULT FALSE,
    fecha_inicio TIMESTAMP,
    fecha_fin TIMESTAMP,
    segmentacion_json JSON -- Para reglas complejas (ej: {tipo: 'Categoria', id: 5} o {tipo: 'MontoMinimo', valor: 200})
);

CREATE TABLE Pedidos (
    pedido_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    cliente_id BIGINT NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Pendiente Pago', 'Pagado', 'En Preparacion', 'Despachado', 'Entregado', 'Cancelado') NOT NULL,
    total_neto DECIMAL(10, 2) NOT NULL,
    total_impuestos DECIMAL(10, 2) NOT NULL,
    total_envio DECIMAL(10, 2) NOT NULL,
    total_descuento DECIMAL(10, 2) DEFAULT 0.00,
    total_final DECIMAL(10, 2) NOT NULL,
    metodo_entrega ENUM('Domicilio', 'Retiro en Tienda') NOT NULL,
    direccion_envio_id INT, -- Si es Domicilio
    ubicacion_retiro_id INT, -- Si es Retiro en Tienda
    FOREIGN KEY (cliente_id) REFERENCES Clientes(cliente_id),
    FOREIGN KEY (direccion_envio_id) REFERENCES Direcciones(direccion_id),
    FOREIGN KEY (ubicacion_retiro_id) REFERENCES Ubicaciones_Inventario(ubicacion_id)
);

CREATE TABLE Detalle_Pedido (
    detalle_pedido_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    pedido_id BIGINT NOT NULL,
    variante_id INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL,
    descuento_aplicado DECIMAL(10, 2) DEFAULT 0.00,
    subtotal DECIMAL(10, 2) NOT NULL,
    ubicacion_stock_origen INT, -- Para saber si se vendió de Tienda o Proveedor (para reportes)
    FOREIGN KEY (pedido_id) REFERENCES Pedidos(pedido_id),
    FOREIGN KEY (variante_id) REFERENCES Variantes_Producto(variante_id),
    FOREIGN KEY (ubicacion_stock_origen) REFERENCES Ubicaciones_Inventario(ubicacion_id)
);

CREATE TABLE Transacciones_Pago (
    transaccion_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    pedido_id BIGINT NOT NULL,
    referencia_pasarela VARCHAR(255) NOT NULL, -- ID devuelto por VISA/Yape/Pasarela
    metodo_pago VARCHAR(50) NOT NULL, -- Ej: Visa, Yape, PagoEfectivo
    monto DECIMAL(10, 2) NOT NULL,
    fecha_transaccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('Aprobado', 'Rechazado', 'Pendiente') NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES Pedidos(pedido_id)
);

CREATE TABLE Seguimiento_Despacho (
    seguimiento_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    pedido_id BIGINT NOT NULL UNIQUE,
    operador_id INT NOT NULL,
    numero_guia VARCHAR(100) NOT NULL, -- Tracking ID del operador subcontratado
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pedido_id) REFERENCES Pedidos(pedido_id),
    FOREIGN KEY (operador_id) REFERENCES Operadores_Logisticos(operador_id)
);