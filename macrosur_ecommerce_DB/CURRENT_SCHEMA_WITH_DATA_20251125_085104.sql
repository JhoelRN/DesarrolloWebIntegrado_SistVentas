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
-- Dumping data for table `alarmas_stock`
--

LOCK TABLES `alarmas_stock` WRITE;
/*!40000 ALTER TABLE `alarmas_stock` DISABLE KEYS */;
/*!40000 ALTER TABLE `alarmas_stock` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `atributos`
--

LOCK TABLES `atributos` WRITE;
/*!40000 ALTER TABLE `atributos` DISABLE KEYS */;
/*!40000 ALTER TABLE `atributos` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Hogar y Decoración','Productos para el hogar y decoración',NULL,1),(2,'Textiles','Ropa de cama y textiles para el hogar',NULL,1),(3,'Muebles','Muebles y mobiliario diverso',NULL,1),(4,'Electrodomésticos','Electrodomésticos para el hogar',NULL,1);
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `clientes`
--

LOCK TABLES `clientes` WRITE;
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` VALUES (1,'María Elena','González Pérez','maria.gonzalez@email.com','$2b$10$example_hash_1','987654321','2025-10-14 04:06:43'),(2,'Juan Carlos','Pérez Rodríguez','juan.perez@email.com','$2b$10$example_hash_2','987654322','2025-10-14 04:06:43'),(3,'Ana Sofía','Rodríguez Silva','ana.rodriguez@email.com','$2b$10$example_hash_3','987654323','2025-10-14 04:06:43'),(4,'Carlos Miguel','Silva Torres','carlos.silva@email.com','$2b$10$example_hash_4','987654324','2025-10-14 04:06:43'),(5,'Lucía Isabel','Torres Mendoza','lucia.torres@email.com','$2b$10$example_hash_5','987654325','2025-10-14 04:06:43');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `contenido_informativo`
--

LOCK TABLES `contenido_informativo` WRITE;
/*!40000 ALTER TABLE `contenido_informativo` DISABLE KEYS */;
/*!40000 ALTER TABLE `contenido_informativo` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `detalle_orden_reposicion`
--

LOCK TABLES `detalle_orden_reposicion` WRITE;
/*!40000 ALTER TABLE `detalle_orden_reposicion` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalle_orden_reposicion` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `detalle_pedido`
--

LOCK TABLES `detalle_pedido` WRITE;
/*!40000 ALTER TABLE `detalle_pedido` DISABLE KEYS */;
INSERT INTO `detalle_pedido` VALUES (1,1,1,1250.00,1,0.00,1250.00,1),(2,2,2,320.00,1,30.00,290.00,1),(3,3,3,890.00,1,0.00,890.00,2),(4,4,4,450.00,1,25.00,425.00,1),(5,4,5,180.00,1,25.00,155.00,1),(6,5,6,280.00,1,0.00,280.00,2),(7,5,8,95.00,1,0.00,95.00,2),(8,6,5,180.00,1,0.00,180.00,2),(9,7,7,420.00,1,35.00,385.00,1),(10,7,2,320.00,1,35.00,285.00,1),(11,8,4,450.00,1,25.00,425.00,3),(12,8,8,95.00,1,0.00,95.00,3),(13,9,6,280.00,1,0.00,280.00,3),(14,10,8,95.00,1,0.00,95.00,1);
/*!40000 ALTER TABLE `detalle_pedido` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `direcciones`
--

LOCK TABLES `direcciones` WRITE;
/*!40000 ALTER TABLE `direcciones` DISABLE KEYS */;
INSERT INTO `direcciones` VALUES (1,1,'Casa','Av. Los Pinos','123','Lima','Lima','15001',1),(2,2,'Casa','Jr. Las Flores','456','Lima','Lima','15002',1),(3,3,'Oficina','Av. Empresarial','789','Lima','Lima','15003',1),(4,4,'Casa','Calle Los Sauces','321','Lima','Lima','15004',1),(5,5,'Departamento','Av. La Marina','654','Lima','Lima','15005',1);
/*!40000 ALTER TABLE `direcciones` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `inventario`
--

LOCK TABLES `inventario` WRITE;
/*!40000 ALTER TABLE `inventario` DISABLE KEYS */;
INSERT INTO `inventario` VALUES (1,1,1,12,5),(2,1,2,28,10),(3,1,3,8,3),(4,2,1,45,15),(5,2,2,85,25),(6,2,3,22,8),(7,3,1,6,2),(8,3,2,15,5),(9,3,3,4,2),(10,4,1,18,6),(11,4,2,32,12),(12,4,3,11,4),(13,5,1,65,20),(14,5,2,95,30),(15,5,3,38,15),(16,6,1,24,8),(17,6,2,46,15),(18,6,3,19,6),(19,7,1,15,5),(20,7,2,22,8),(21,7,3,9,3),(22,8,1,28,10),(23,8,2,42,15),(24,8,3,18,6);
/*!40000 ALTER TABLE `inventario` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `metodos_pago_cliente`
--

LOCK TABLES `metodos_pago_cliente` WRITE;
/*!40000 ALTER TABLE `metodos_pago_cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `metodos_pago_cliente` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `movimientos_stock`
--

LOCK TABLES `movimientos_stock` WRITE;
/*!40000 ALTER TABLE `movimientos_stock` DISABLE KEYS */;
/*!40000 ALTER TABLE `movimientos_stock` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `operadores_logisticos`
--

LOCK TABLES `operadores_logisticos` WRITE;
/*!40000 ALTER TABLE `operadores_logisticos` DISABLE KEYS */;
/*!40000 ALTER TABLE `operadores_logisticos` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `ordenes_reposicion`
--

LOCK TABLES `ordenes_reposicion` WRITE;
/*!40000 ALTER TABLE `ordenes_reposicion` DISABLE KEYS */;
/*!40000 ALTER TABLE `ordenes_reposicion` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `pedidos`
--

LOCK TABLES `pedidos` WRITE;
/*!40000 ALTER TABLE `pedidos` DISABLE KEYS */;
INSERT INTO `pedidos` VALUES (1,1,'2024-10-15 19:30:00','Entregado',1250.00,225.00,50.00,0.00,1525.00,'Domicilio',1,NULL),(2,2,'2024-10-18 15:15:00','Entregado',320.00,57.60,25.00,30.00,372.60,'Domicilio',2,NULL),(3,3,'2024-10-22 21:45:00','Entregado',890.00,160.20,75.00,0.00,1125.20,'Domicilio',3,NULL),(4,4,'2024-11-05 16:20:00','Entregado',630.00,113.40,40.00,50.00,733.40,'Retiro en Tienda',NULL,NULL),(5,5,'2024-11-12 14:30:00','Entregado',375.00,67.50,30.00,0.00,472.50,'Domicilio',5,NULL),(6,1,'2024-11-20 20:10:00','Entregado',180.00,32.40,20.00,0.00,232.40,'Domicilio',1,NULL),(7,2,'2024-12-03 18:25:00','Entregado',700.00,126.00,45.00,70.00,801.00,'Domicilio',2,NULL),(8,3,'2024-12-15 22:40:00','Despachado',515.00,92.70,35.00,25.00,617.70,'Domicilio',3,NULL),(9,4,'2024-12-20 17:05:00','En Preparacion',280.00,50.40,25.00,0.00,355.40,'Retiro en Tienda',NULL,NULL),(10,5,'2025-01-08 19:50:00','Pagado',95.00,17.10,15.00,0.00,127.10,'Domicilio',5,NULL);
/*!40000 ALTER TABLE `pedidos` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES (3,'AUTORIZAR_REPOSICION'),(10,'CREAR_CATEGORIAS'),(6,'CREAR_PRODUCTOS'),(21,'CREAR_PROMOCIONES'),(1,'CRUD_PRODUCTOS'),(11,'EDITAR_CATEGORIAS'),(7,'EDITAR_PRODUCTOS'),(8,'ELIMINAR_PRODUCTOS'),(4,'GESTION_USUARIOS'),(17,'GESTIONAR_ENVIOS'),(18,'GESTIONAR_PEDIDOS'),(23,'GESTIONAR_RECLAMOS'),(13,'GESTIONAR_RESENAS'),(15,'GESTIONAR_STOCK'),(24,'GESTIONAR_USUARIOS'),(27,'REPORTE_INVENTARIO'),(26,'REPORTE_PRODUCTOS'),(29,'REPORTE_USUARIOS'),(28,'REPORTE_VENTAS'),(9,'VER_CATEGORIAS'),(19,'VER_CLIENTES'),(25,'VER_DASHBOARD_ADMIN'),(14,'VER_INVENTARIO'),(16,'VER_LOGISTICA'),(2,'VER_PEDIDOS'),(5,'VER_PRODUCTOS'),(20,'VER_PROMOCIONES'),(22,'VER_RECLAMOS'),(12,'VER_RESENAS');
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `producto_categoria`
--

LOCK TABLES `producto_categoria` WRITE;
/*!40000 ALTER TABLE `producto_categoria` DISABLE KEYS */;
INSERT INTO `producto_categoria` VALUES (1,1),(4,1),(7,1),(8,1),(2,2),(5,2),(6,2),(3,3);
/*!40000 ALTER TABLE `producto_categoria` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,'PROD-001','Alfombra Persa Grande 200x300','Alfombra de alta calidad estilo persa importada',NULL,1250.00,15.50,0.1200,'2025-10-14 04:06:43'),(2,'PROD-002','Juego de Sábanas Premium King','Sábanas 100% algodón egipcio, 600 hilos',NULL,320.00,2.00,0.0150,'2025-10-14 04:06:43'),(3,'PROD-003','Mesa de Centro Moderna Roble','Mesa de centro en madera de roble macizo',NULL,890.00,25.00,0.8000,'2025-10-14 04:06:43'),(4,'PROD-004','Lámpara de Pie Vintage Bronce','Lámpara decorativa estilo vintage con base de bronce',NULL,450.00,5.50,0.0500,'2025-10-14 04:06:43'),(5,'PROD-005','Set 4 Cojines Decorativos','Set de cojines decorativos variados colores',NULL,180.00,1.20,0.0200,'2025-10-14 04:06:43'),(6,'PROD-006','Cortinas Blackout 140x220','Cortinas blackout para dormitorio, varios colores',NULL,280.00,3.00,0.0250,'2025-10-14 04:06:43'),(7,'PROD-007','Espejo Decorativo Marco Dorado','Espejo redondo con marco dorado ornamentado',NULL,420.00,8.50,0.0400,'2025-10-14 04:06:43'),(8,'PROD-008','Florero Cerámica Artesanal','Florero de cerámica hecho a mano, diseño único',NULL,95.00,2.80,0.0080,'2025-10-14 04:06:43');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (1,'Textiles Premium SAC','Ana García Textiles','01-2345678'),(2,'Muebles del Norte SRL','Carlos Mendoza Muebles','01-3456789'),(3,'Decoración Import EIRL','María López Decoración','01-4567890');
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `reclamaciones`
--

LOCK TABLES `reclamaciones` WRITE;
/*!40000 ALTER TABLE `reclamaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `reclamaciones` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `reglas_descuento`
--

LOCK TABLES `reglas_descuento` WRITE;
/*!40000 ALTER TABLE `reglas_descuento` DISABLE KEYS */;
/*!40000 ALTER TABLE `reglas_descuento` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `resenas`
--

LOCK TABLES `resenas` WRITE;
/*!40000 ALTER TABLE `resenas` DISABLE KEYS */;
/*!40000 ALTER TABLE `resenas` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `rol_permiso`
--

LOCK TABLES `rol_permiso` WRITE;
/*!40000 ALTER TABLE `rol_permiso` DISABLE KEYS */;
INSERT INTO `rol_permiso` VALUES (1,1),(3,1),(1,2),(4,2),(1,3),(2,3),(1,4),(1,5),(3,5),(1,6),(3,6),(1,7),(3,7),(1,8),(3,8),(1,9),(3,9),(1,10),(3,10),(1,11),(3,11),(1,12),(3,12),(1,13),(3,13),(1,14),(2,14),(1,15),(2,15),(1,16),(2,16),(1,17),(2,17),(1,18),(4,18),(1,19),(4,19),(1,20),(4,20),(1,21),(4,21),(1,22),(4,22),(1,23),(4,23),(1,24),(1,25),(1,26),(3,26),(1,27),(2,27),(1,28),(4,28),(1,29);
/*!40000 ALTER TABLE `rol_permiso` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN'),(4,'GESTOR_COMERCIAL'),(2,'GESTOR_LOGISTICA'),(3,'GESTOR_PRODUCTOS');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `seguimiento_despacho`
--

LOCK TABLES `seguimiento_despacho` WRITE;
/*!40000 ALTER TABLE `seguimiento_despacho` DISABLE KEYS */;
/*!40000 ALTER TABLE `seguimiento_despacho` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `transacciones_pago`
--

LOCK TABLES `transacciones_pago` WRITE;
/*!40000 ALTER TABLE `transacciones_pago` DISABLE KEYS */;
/*!40000 ALTER TABLE `transacciones_pago` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `ubicaciones_inventario`
--

LOCK TABLES `ubicaciones_inventario` WRITE;
/*!40000 ALTER TABLE `ubicaciones_inventario` DISABLE KEYS */;
INSERT INTO `ubicaciones_inventario` VALUES (1,'Tienda Central Miraflores',1,'Av. Larco 1234, Miraflores, Lima',NULL),(2,'Almacén Principal Callao',1,'Av. Industrial 567, Callao',NULL),(3,'Tienda San Isidro',1,'Av. Conquistadores 890, San Isidro, Lima',NULL);
/*!40000 ALTER TABLE `ubicaciones_inventario` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `usuarios_admin`
--

LOCK TABLES `usuarios_admin` WRITE;
/*!40000 ALTER TABLE `usuarios_admin` DISABLE KEYS */;
INSERT INTO `usuarios_admin` VALUES (1,1,'Admin','Macrosur','admin@macrosur.com','$2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO',1,'2025-10-14 04:04:38'),(2,2,'Carlos','Logistics','carlos.logistics@macrosur.com','$2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO',1,'2025-10-14 04:04:38'),(3,3,'Maria','Products','maria.products@macrosur.com','$2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO',1,'2025-10-14 04:04:38'),(4,4,'Juan','Sales','juan.sales@macrosur.com','$2a$10$06uLSINbNj067mJWckEjPuIAU7ajP0ocqL3WRqFs0ND5.aYw523yO',1,'2025-10-14 04:04:38'),(5,1,'Juan','Perez','juan.products@macrosur.com','$2a$10$t8zTiSOknDn0VWIMvmf0re4XmsTxnicXkV7BPum5re6XF1OmjE1vW',1,'2025-11-25 12:16:16');
/*!40000 ALTER TABLE `usuarios_admin` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `valores_atributo`
--

LOCK TABLES `valores_atributo` WRITE;
/*!40000 ALTER TABLE `valores_atributo` DISABLE KEYS */;
/*!40000 ALTER TABLE `valores_atributo` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `variante_valor`
--

LOCK TABLES `variante_valor` WRITE;
/*!40000 ALTER TABLE `variante_valor` DISABLE KEYS */;
/*!40000 ALTER TABLE `variante_valor` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `variantes_producto`
--

LOCK TABLES `variantes_producto` WRITE;
/*!40000 ALTER TABLE `variantes_producto` DISABLE KEYS */;
INSERT INTO `variantes_producto` VALUES (1,1,'ALF-PER-001',1250.00,'/images/alfombra-persa-grande.jpg'),(2,2,'SAB-PREM-001',320.00,'/images/sabanas-premium-king.jpg'),(3,3,'MES-MOD-001',890.00,'/images/mesa-centro-roble.jpg'),(4,4,'LAM-VIN-001',450.00,'/images/lampara-vintage-bronce.jpg'),(5,5,'COJ-SET-001',180.00,'/images/cojines-decorativos.jpg'),(6,6,'CORT-BLK-001',280.00,'/images/cortinas-blackout.jpg'),(7,7,'ESP-DOR-001',420.00,'/images/espejo-marco-dorado.jpg'),(8,8,'FLO-CER-001',95.00,'/images/florero-ceramica.jpg');
/*!40000 ALTER TABLE `variantes_producto` ENABLE KEYS */;
UNLOCK TABLES;

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
