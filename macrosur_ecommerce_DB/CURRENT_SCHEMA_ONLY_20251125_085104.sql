-- MySQL dump 10.13  Distrib 8.4.6, for Win64 (x86_64)
--
-- Host: localhost    Database: macrosur_ecommerce
-- ------------------------------------------------------
-- Server version	8.4.6

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `macrosur_ecommerce`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `macrosur_ecommerce` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `macrosur_ecommerce`;

--
-- Table structure for table `alarmas_stock`
--

DROP TABLE IF EXISTS `alarmas_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alarmas_stock` (
  `alarma_id` int NOT NULL AUTO_INCREMENT,
  `variante_id` int NOT NULL,
  `ubicacion_id` int NOT NULL,
  `tipo_alarma` enum('Bajo Stock','Stock Cero','Venta Consignada') NOT NULL,
  `fecha_alarma` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `resuelto` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`alarma_id`),
  KEY `variante_id` (`variante_id`),
  KEY `ubicacion_id` (`ubicacion_id`),
  CONSTRAINT `alarmas_stock_ibfk_1` FOREIGN KEY (`variante_id`) REFERENCES `variantes_producto` (`variante_id`),
  CONSTRAINT `alarmas_stock_ibfk_2` FOREIGN KEY (`ubicacion_id`) REFERENCES `ubicaciones_inventario` (`ubicacion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `atributos`
--

DROP TABLE IF EXISTS `atributos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `atributos` (
  `atributo_id` int NOT NULL AUTO_INCREMENT,
  `nombre_atributo` varchar(100) NOT NULL,
  PRIMARY KEY (`atributo_id`),
  UNIQUE KEY `nombre_atributo` (`nombre_atributo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `categoria_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `categoria_padre_id` int DEFAULT NULL,
  `visible_cliente` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`categoria_id`),
  UNIQUE KEY `nombre` (`nombre`),
  KEY `categoria_padre_id` (`categoria_padre_id`),
  CONSTRAINT `categorias_ibfk_1` FOREIGN KEY (`categoria_padre_id`) REFERENCES `categorias` (`categoria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `cliente_id` bigint NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo` varchar(150) NOT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`cliente_id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `contenido_informativo`
--

DROP TABLE IF EXISTS `contenido_informativo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contenido_informativo` (
  `contenido_id` int NOT NULL AUTO_INCREMENT,
  `clave_unica` varchar(50) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `contenido_html` text NOT NULL,
  `ultima_modificacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`contenido_id`),
  UNIQUE KEY `clave_unica` (`clave_unica`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detalle_orden_reposicion`
--

DROP TABLE IF EXISTS `detalle_orden_reposicion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_orden_reposicion` (
  `detalle_orden_id` int NOT NULL AUTO_INCREMENT,
  `orden_reposicion_id` int NOT NULL,
  `variante_id` int NOT NULL,
  `cantidad_pedida` int NOT NULL,
  `costo_unitario` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`detalle_orden_id`),
  KEY `orden_reposicion_id` (`orden_reposicion_id`),
  KEY `variante_id` (`variante_id`),
  CONSTRAINT `detalle_orden_reposicion_ibfk_1` FOREIGN KEY (`orden_reposicion_id`) REFERENCES `ordenes_reposicion` (`orden_reposicion_id`),
  CONSTRAINT `detalle_orden_reposicion_ibfk_2` FOREIGN KEY (`variante_id`) REFERENCES `variantes_producto` (`variante_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `detalle_pedido`
--

DROP TABLE IF EXISTS `detalle_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_pedido` (
  `detalle_pedido_id` bigint NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint NOT NULL,
  `variante_id` int NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `cantidad` int NOT NULL,
  `descuento_aplicado` decimal(10,2) DEFAULT '0.00',
  `subtotal` decimal(10,2) NOT NULL,
  `ubicacion_stock_origen` int DEFAULT NULL,
  PRIMARY KEY (`detalle_pedido_id`),
  KEY `pedido_id` (`pedido_id`),
  KEY `variante_id` (`variante_id`),
  KEY `ubicacion_stock_origen` (`ubicacion_stock_origen`),
  CONSTRAINT `detalle_pedido_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`pedido_id`),
  CONSTRAINT `detalle_pedido_ibfk_2` FOREIGN KEY (`variante_id`) REFERENCES `variantes_producto` (`variante_id`),
  CONSTRAINT `detalle_pedido_ibfk_3` FOREIGN KEY (`ubicacion_stock_origen`) REFERENCES `ubicaciones_inventario` (`ubicacion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `direcciones`
--

DROP TABLE IF EXISTS `direcciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `direcciones` (
  `direccion_id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint NOT NULL,
  `alias` varchar(50) DEFAULT NULL,
  `calle` varchar(255) NOT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `ciudad` varchar(100) NOT NULL,
  `departamento` varchar(100) NOT NULL,
  `codigo_postal` varchar(20) DEFAULT NULL,
  `es_principal` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`direccion_id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `direcciones_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `inventario`
--

DROP TABLE IF EXISTS `inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventario` (
  `inventario_id` int NOT NULL AUTO_INCREMENT,
  `variante_id` int NOT NULL,
  `ubicacion_id` int NOT NULL,
  `cantidad` int NOT NULL DEFAULT '0',
  `stock_minimo_seguridad` int DEFAULT '0',
  PRIMARY KEY (`inventario_id`),
  UNIQUE KEY `variante_id` (`variante_id`,`ubicacion_id`),
  KEY `ubicacion_id` (`ubicacion_id`),
  CONSTRAINT `inventario_ibfk_1` FOREIGN KEY (`variante_id`) REFERENCES `variantes_producto` (`variante_id`),
  CONSTRAINT `inventario_ibfk_2` FOREIGN KEY (`ubicacion_id`) REFERENCES `ubicaciones_inventario` (`ubicacion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `metodos_pago_cliente`
--

DROP TABLE IF EXISTS `metodos_pago_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `metodos_pago_cliente` (
  `metodo_pago_id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint NOT NULL,
  `token_pago` varchar(255) NOT NULL,
  `ultimos_digitos` varchar(4) DEFAULT NULL,
  `tipo_tarjeta` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`metodo_pago_id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `metodos_pago_cliente_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `movimientos_stock`
--

DROP TABLE IF EXISTS `movimientos_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `movimientos_stock` (
  `movimiento_id` bigint NOT NULL AUTO_INCREMENT,
  `variante_id` int NOT NULL,
  `ubicacion_origen_id` int DEFAULT NULL,
  `ubicacion_destino_id` int DEFAULT NULL,
  `cantidad_movida` int NOT NULL,
  `tipo_movimiento` enum('Salida Venta','Entrada Compra','Ajuste','Transferencia') NOT NULL,
  `fecha_movimiento` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `pedido_id` bigint DEFAULT NULL,
  PRIMARY KEY (`movimiento_id`),
  KEY `variante_id` (`variante_id`),
  KEY `ubicacion_origen_id` (`ubicacion_origen_id`),
  KEY `ubicacion_destino_id` (`ubicacion_destino_id`),
  CONSTRAINT `movimientos_stock_ibfk_1` FOREIGN KEY (`variante_id`) REFERENCES `variantes_producto` (`variante_id`),
  CONSTRAINT `movimientos_stock_ibfk_2` FOREIGN KEY (`ubicacion_origen_id`) REFERENCES `ubicaciones_inventario` (`ubicacion_id`),
  CONSTRAINT `movimientos_stock_ibfk_3` FOREIGN KEY (`ubicacion_destino_id`) REFERENCES `ubicaciones_inventario` (`ubicacion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `operadores_logisticos`
--

DROP TABLE IF EXISTS `operadores_logisticos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `operadores_logisticos` (
  `operador_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `url_rastreo_base` varchar(255) NOT NULL,
  PRIMARY KEY (`operador_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ordenes_reposicion`
--

DROP TABLE IF EXISTS `ordenes_reposicion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordenes_reposicion` (
  `orden_reposicion_id` int NOT NULL AUTO_INCREMENT,
  `proveedor_id` int NOT NULL,
  `fecha_solicitud` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_autorizacion` timestamp NULL DEFAULT NULL,
  `usuario_admin_id_autoriza` int DEFAULT NULL,
  `estado_autorizacion` enum('Pendiente','Autorizada','Rechazada') DEFAULT 'Pendiente',
  `costo_total` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`orden_reposicion_id`),
  KEY `proveedor_id` (`proveedor_id`),
  KEY `usuario_admin_id_autoriza` (`usuario_admin_id_autoriza`),
  CONSTRAINT `ordenes_reposicion_ibfk_1` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`proveedor_id`),
  CONSTRAINT `ordenes_reposicion_ibfk_2` FOREIGN KEY (`usuario_admin_id_autoriza`) REFERENCES `usuarios_admin` (`usuario_admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `pedidos`
--

DROP TABLE IF EXISTS `pedidos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedidos` (
  `pedido_id` bigint NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint NOT NULL,
  `fecha_pedido` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Pendiente Pago','Pagado','En Preparacion','Despachado','Entregado','Cancelado') NOT NULL,
  `total_neto` decimal(10,2) NOT NULL,
  `total_impuestos` decimal(10,2) NOT NULL,
  `total_envio` decimal(10,2) NOT NULL,
  `total_descuento` decimal(10,2) DEFAULT '0.00',
  `total_final` decimal(10,2) NOT NULL,
  `metodo_entrega` enum('Domicilio','Retiro en Tienda') NOT NULL,
  `direccion_envio_id` int DEFAULT NULL,
  `ubicacion_retiro_id` int DEFAULT NULL,
  PRIMARY KEY (`pedido_id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `direccion_envio_id` (`direccion_envio_id`),
  KEY `ubicacion_retiro_id` (`ubicacion_retiro_id`),
  CONSTRAINT `pedidos_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`),
  CONSTRAINT `pedidos_ibfk_2` FOREIGN KEY (`direccion_envio_id`) REFERENCES `direcciones` (`direccion_id`),
  CONSTRAINT `pedidos_ibfk_3` FOREIGN KEY (`ubicacion_retiro_id`) REFERENCES `ubicaciones_inventario` (`ubicacion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `permisos`
--

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `permiso_id` int NOT NULL AUTO_INCREMENT,
  `nombre_permiso` varchar(100) NOT NULL,
  PRIMARY KEY (`permiso_id`),
  UNIQUE KEY `nombre_permiso` (`nombre_permiso`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `producto_categoria`
--

DROP TABLE IF EXISTS `producto_categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_categoria` (
  `producto_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  PRIMARY KEY (`producto_id`,`categoria_id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `producto_categoria_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`),
  CONSTRAINT `producto_categoria_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`categoria_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `producto_id` int NOT NULL AUTO_INCREMENT,
  `codigo_producto` varchar(50) DEFAULT NULL,
  `nombre_producto` varchar(255) NOT NULL,
  `descripcion_corta` varchar(500) DEFAULT NULL,
  `ficha_tecnica_html` text,
  `precio_unitario` decimal(10,2) DEFAULT '0.00',
  `peso_kg` decimal(8,2) NOT NULL,
  `volumen_m3` decimal(8,4) DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`producto_id`),
  UNIQUE KEY `codigo_producto` (`codigo_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `proveedor_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(150) NOT NULL,
  `contacto` varchar(150) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`proveedor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reclamaciones`
--

DROP TABLE IF EXISTS `reclamaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reclamaciones` (
  `reclamo_id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint NOT NULL,
  `pedido_id` bigint DEFAULT NULL,
  `tipo_documento` enum('Boleta','Factura') DEFAULT NULL,
  `numero_documento` varchar(50) DEFAULT NULL,
  `tipo_reclamo` enum('Producto Defectuoso','Servicio','Despacho','Otros') NOT NULL,
  `detalle_reclamo` text NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Pendiente','En Proceso','Resuelto') DEFAULT 'Pendiente',
  PRIMARY KEY (`reclamo_id`),
  KEY `cliente_id` (`cliente_id`),
  CONSTRAINT `reclamaciones_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reglas_descuento`
--

DROP TABLE IF EXISTS `reglas_descuento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reglas_descuento` (
  `regla_id` int NOT NULL AUTO_INCREMENT,
  `nombre_regla` varchar(100) NOT NULL,
  `tipo_descuento` enum('Porcentaje','Monto Fijo','2x1','Envio Gratis') NOT NULL,
  `valor_descuento` decimal(10,2) NOT NULL,
  `acumulable` tinyint(1) DEFAULT '1',
  `exclusivo` tinyint(1) DEFAULT '0',
  `fecha_inicio` timestamp NULL DEFAULT NULL,
  `fecha_fin` timestamp NULL DEFAULT NULL,
  `segmentacion_json` json DEFAULT NULL,
  PRIMARY KEY (`regla_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `resenas`
--

DROP TABLE IF EXISTS `resenas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `resenas` (
  `resena_id` bigint NOT NULL AUTO_INCREMENT,
  `cliente_id` bigint NOT NULL,
  `producto_id` int NOT NULL,
  `calificacion` tinyint NOT NULL,
  `comentario` text,
  `fecha_resena` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado_resena` enum('Pendiente','Aprobada','Rechazada') DEFAULT 'Pendiente',
  `fecha_compra_verificada` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`resena_id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `resenas_ibfk_1` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`cliente_id`),
  CONSTRAINT `resenas_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`),
  CONSTRAINT `resenas_chk_1` CHECK ((`calificacion` between 1 and 5))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `rol_permiso`
--

DROP TABLE IF EXISTS `rol_permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol_permiso` (
  `rol_id` int NOT NULL,
  `permiso_id` int NOT NULL,
  PRIMARY KEY (`rol_id`,`permiso_id`),
  KEY `permiso_id` (`permiso_id`),
  CONSTRAINT `rol_permiso_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`),
  CONSTRAINT `rol_permiso_ibfk_2` FOREIGN KEY (`permiso_id`) REFERENCES `permisos` (`permiso_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` varchar(50) NOT NULL,
  PRIMARY KEY (`rol_id`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `seguimiento_despacho`
--

DROP TABLE IF EXISTS `seguimiento_despacho`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seguimiento_despacho` (
  `seguimiento_id` bigint NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint NOT NULL,
  `operador_id` int NOT NULL,
  `numero_guia` varchar(100) NOT NULL,
  `fecha_asignacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`seguimiento_id`),
  UNIQUE KEY `pedido_id` (`pedido_id`),
  KEY `operador_id` (`operador_id`),
  CONSTRAINT `seguimiento_despacho_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`pedido_id`),
  CONSTRAINT `seguimiento_despacho_ibfk_2` FOREIGN KEY (`operador_id`) REFERENCES `operadores_logisticos` (`operador_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `transacciones_pago`
--

DROP TABLE IF EXISTS `transacciones_pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transacciones_pago` (
  `transaccion_id` bigint NOT NULL AUTO_INCREMENT,
  `pedido_id` bigint NOT NULL,
  `referencia_pasarela` varchar(255) NOT NULL,
  `metodo_pago` varchar(50) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_transaccion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('Aprobado','Rechazado','Pendiente') NOT NULL,
  PRIMARY KEY (`transaccion_id`),
  KEY `pedido_id` (`pedido_id`),
  CONSTRAINT `transacciones_pago_ibfk_1` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`pedido_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `ubicaciones_inventario`
--

DROP TABLE IF EXISTS `ubicaciones_inventario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ubicaciones_inventario` (
  `ubicacion_id` int NOT NULL AUTO_INCREMENT,
  `nombre_ubicacion` varchar(100) NOT NULL,
  `es_fisica` tinyint(1) NOT NULL DEFAULT '1',
  `direccion_fisica` text,
  `proveedor_id` int DEFAULT NULL,
  PRIMARY KEY (`ubicacion_id`),
  KEY `proveedor_id` (`proveedor_id`),
  CONSTRAINT `ubicaciones_inventario_ibfk_1` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`proveedor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `usuarios_admin`
--

DROP TABLE IF EXISTS `usuarios_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios_admin` (
  `usuario_admin_id` int NOT NULL AUTO_INCREMENT,
  `rol_id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `correo_corporativo` varchar(150) NOT NULL,
  `contrasena_hash` varchar(255) NOT NULL,
  `activo` tinyint(1) DEFAULT '1',
  `fecha_creacion` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`usuario_admin_id`),
  UNIQUE KEY `correo_corporativo` (`correo_corporativo`),
  KEY `rol_id` (`rol_id`),
  CONSTRAINT `usuarios_admin_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`),
  CONSTRAINT `usuarios_admin_chk_1` CHECK ((`correo_corporativo` like _utf8mb4'%@macrosur.com'))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `valores_atributo`
--

DROP TABLE IF EXISTS `valores_atributo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `valores_atributo` (
  `valor_id` int NOT NULL AUTO_INCREMENT,
  `atributo_id` int NOT NULL,
  `valor` varchar(100) NOT NULL,
  PRIMARY KEY (`valor_id`),
  KEY `atributo_id` (`atributo_id`),
  CONSTRAINT `valores_atributo_ibfk_1` FOREIGN KEY (`atributo_id`) REFERENCES `atributos` (`atributo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `variante_valor`
--

DROP TABLE IF EXISTS `variante_valor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variante_valor` (
  `variante_id` int NOT NULL,
  `valor_id` int NOT NULL,
  PRIMARY KEY (`variante_id`,`valor_id`),
  KEY `valor_id` (`valor_id`),
  CONSTRAINT `variante_valor_ibfk_1` FOREIGN KEY (`variante_id`) REFERENCES `variantes_producto` (`variante_id`),
  CONSTRAINT `variante_valor_ibfk_2` FOREIGN KEY (`valor_id`) REFERENCES `valores_atributo` (`valor_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `variantes_producto`
--

DROP TABLE IF EXISTS `variantes_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variantes_producto` (
  `variante_id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `sku` varchar(50) NOT NULL,
  `precio_base` decimal(10,2) NOT NULL,
  `url_imagen_principal` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`variante_id`),
  UNIQUE KEY `sku` (`sku`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `variantes_producto_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `productos` (`producto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `vista_inventario`
--

DROP TABLE IF EXISTS `vista_inventario`;
/*!50001 DROP VIEW IF EXISTS `vista_inventario`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_inventario` AS SELECT 
 1 AS `producto_id`,
 1 AS `codigo_producto`,
 1 AS `producto`,
 1 AS `stock_actual`,
 1 AS `stock_minimo`,
 1 AS `ubicacion`,
 1 AS `almacen_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `vista_ventas`
--

DROP TABLE IF EXISTS `vista_ventas`;
/*!50001 DROP VIEW IF EXISTS `vista_ventas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `vista_ventas` AS SELECT 
 1 AS `pedido_id`,
 1 AS `fecha`,
 1 AS `cliente_nombre`,
 1 AS `productos_descripcion`,
 1 AS `total`,
 1 AS `estado`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping events for database 'macrosur_ecommerce'
--

--
-- Dumping routines for database 'macrosur_ecommerce'
--

--
-- Current Database: `macrosur_ecommerce`
--

USE `macrosur_ecommerce`;

--
-- Final view structure for view `vista_inventario`
--

/*!50001 DROP VIEW IF EXISTS `vista_inventario`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_inventario` AS select `p`.`producto_id` AS `producto_id`,`p`.`codigo_producto` AS `codigo_producto`,`p`.`nombre_producto` AS `producto`,coalesce(`i`.`cantidad`,0) AS `stock_actual`,coalesce(`i`.`stock_minimo_seguridad`,0) AS `stock_minimo`,coalesce(`ui`.`nombre_ubicacion`,'Sin ubicación') AS `ubicacion`,`ui`.`ubicacion_id` AS `almacen_id` from (((`productos` `p` left join `variantes_producto` `vp` on((`p`.`producto_id` = `vp`.`producto_id`))) left join `inventario` `i` on((`vp`.`variante_id` = `i`.`variante_id`))) left join `ubicaciones_inventario` `ui` on((`i`.`ubicacion_id` = `ui`.`ubicacion_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `vista_ventas`
--

/*!50001 DROP VIEW IF EXISTS `vista_ventas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `vista_ventas` AS select `p`.`pedido_id` AS `pedido_id`,cast(`p`.`fecha_pedido` as date) AS `fecha`,concat(coalesce(`c`.`nombre`,'Cliente'),' ',coalesce(`c`.`apellido`,'Anónimo')) AS `cliente_nombre`,group_concat(concat(coalesce(`prod`.`nombre_producto`,'Producto'),' (',`dp`.`cantidad`,')') separator ', ') AS `productos_descripcion`,`p`.`total_final` AS `total`,`p`.`estado` AS `estado` from ((((`pedidos` `p` left join `clientes` `c` on((`p`.`cliente_id` = `c`.`cliente_id`))) left join `detalle_pedido` `dp` on((`p`.`pedido_id` = `dp`.`pedido_id`))) left join `variantes_producto` `vp` on((`dp`.`variante_id` = `vp`.`variante_id`))) left join `productos` `prod` on((`vp`.`producto_id` = `prod`.`producto_id`))) group by `p`.`pedido_id`,`p`.`fecha_pedido`,`c`.`nombre`,`c`.`apellido`,`p`.`total_final`,`p`.`estado` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-25  8:51:05
