-- Script para crear tablas del módulo de logística
-- Fecha: 2025-11-27
-- Descripción: Crea todas las tablas necesarias para el módulo de logística

USE macrosur_ecommerce;

-- =============================================
-- 0. ELIMINAR TABLAS EXISTENTES (EN ORDEN INVERSO DE DEPENDENCIAS)
-- =============================================
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS seguimientos_despacho;
DROP TABLE IF EXISTS movimientos_stock;
DROP TABLE IF EXISTS alarmas_stock;
DROP TABLE IF EXISTS detalles_orden_reposicion;
DROP TABLE IF EXISTS ordenes_reposicion;
DROP TABLE IF EXISTS inventario;
DROP TABLE IF EXISTS ubicaciones_inventario;
DROP TABLE IF EXISTS proveedores;
-- NO eliminamos operadores_logisticos porque ya existe con estructura correcta
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- 1. TABLA PROVEEDORES
-- =============================================
CREATE TABLE proveedores (
    proveedor_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contacto VARCHAR(255),
    telefono VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 2. TABLA UBICACIONES_INVENTARIO
-- =============================================
CREATE TABLE ubicaciones_inventario (
    ubicacion_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre_ubicacion VARCHAR(100) NOT NULL,
    tipo_ubicacion VARCHAR(50) NOT NULL,
    direccion TEXT,
    es_fisica BOOLEAN DEFAULT TRUE,
    proveedor_id INT,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(proveedor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 3. TABLA INVENTARIO
-- =============================================
CREATE TABLE inventario (
    inventario_id INT AUTO_INCREMENT PRIMARY KEY,
    variante_id INT NOT NULL,
    ubicacion_id INT NOT NULL,
    cantidad INT DEFAULT 0,
    stock_minimo_seguridad INT DEFAULT 0,
    ultima_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_variante_ubicacion (variante_id, ubicacion_id),
    FOREIGN KEY (variante_id) REFERENCES variantes_producto(variante_id),
    FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones_inventario(ubicacion_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 4. TABLA MOVIMIENTOS_STOCK
-- =============================================
CREATE TABLE movimientos_stock (
    movimiento_stock_id INT AUTO_INCREMENT PRIMARY KEY,
    inventario_id INT NOT NULL,
    tipo_movimiento VARCHAR(50) NOT NULL,
    cantidad INT NOT NULL,
    motivo VARCHAR(255),
    pedido_id BIGINT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventario_id) REFERENCES inventario(inventario_id),
    FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 5. TABLA ALARMAS_STOCK
-- =============================================
CREATE TABLE alarmas_stock (
    alarma_stock_id INT AUTO_INCREMENT PRIMARY KEY,
    inventario_id INT NOT NULL,
    tipo_alarma VARCHAR(50) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resuelta BOOLEAN DEFAULT FALSE,
    fecha_resolucion TIMESTAMP NULL,
    FOREIGN KEY (inventario_id) REFERENCES inventario(inventario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 6. TABLA ORDENES_REPOSICION
-- =============================================
CREATE TABLE ordenes_reposicion (
    orden_reposicion_id INT AUTO_INCREMENT PRIMARY KEY,
    proveedor_id INT NOT NULL,
    fecha_solicitud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_autorizacion TIMESTAMP NULL,
    usuario_admin_id_autoriza INT,
    estado_autorizacion VARCHAR(20) DEFAULT 'PENDIENTE',
    costo_total DECIMAL(10,2) DEFAULT 0.00,
    fecha_recepcion TIMESTAMP NULL,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(proveedor_id),
    FOREIGN KEY (usuario_admin_id_autoriza) REFERENCES usuarios_admin(usuario_admin_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 7. TABLA DETALLES_ORDEN_REPOSICION
-- =============================================
CREATE TABLE detalles_orden_reposicion (
    detalle_orden_reposicion_id INT AUTO_INCREMENT PRIMARY KEY,
    orden_reposicion_id INT NOT NULL,
    variante_producto_id INT NOT NULL,
    cantidad_solicitada INT NOT NULL,
    cantidad_recibida INT DEFAULT 0,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (orden_reposicion_id) REFERENCES ordenes_reposicion(orden_reposicion_id) ON DELETE CASCADE,
    FOREIGN KEY (variante_producto_id) REFERENCES variantes_producto(variante_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 8. TABLA OPERADORES_LOGISTICOS (YA EXISTE, NO SE CREA)
-- =============================================
-- La tabla operadores_logisticos ya existe con estructura:
-- operador_id, nombre, url_rastreo_base

-- =============================================
-- 9. TABLA SEGUIMIENTOS_DESPACHO
-- =============================================
CREATE TABLE seguimientos_despacho (
    seguimiento_despacho_id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT NOT NULL,
    operador_id INT NOT NULL,
    numero_guia VARCHAR(255) NOT NULL,
    estado_envio VARCHAR(50) DEFAULT 'EN_CAMINO',
    fecha_despacho TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_estimada_entrega DATE,
    fecha_entrega TIMESTAMP NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id),
    FOREIGN KEY (operador_id) REFERENCES operadores_logisticos(operador_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 10. INSERTAR DATOS INICIALES
-- =============================================

-- Proveedor por defecto
INSERT INTO proveedores (nombre, contacto, telefono) VALUES
('Proveedor General', 'contacto@proveedor.com', '+56912345678')
ON DUPLICATE KEY UPDATE nombre = nombre;

-- Ubicación por defecto (si no existe)
INSERT INTO ubicaciones_inventario (nombre_ubicacion, tipo_ubicacion, direccion) 
SELECT 'Tienda Principal', 'TIENDA', 'Dirección de la tienda principal'
WHERE NOT EXISTS (SELECT 1 FROM ubicaciones_inventario WHERE nombre_ubicacion = 'Tienda Principal');

-- Operadores logísticos (si no existen ya)
INSERT INTO operadores_logisticos (nombre, url_rastreo_base) VALUES
('Chilexpress', 'https://www.chilexpress.cl/Seguimiento?='),
('Correos de Chile', 'https://www.correos.cl/SitePages/seguimiento/seguimiento.aspx?envio=')
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);
