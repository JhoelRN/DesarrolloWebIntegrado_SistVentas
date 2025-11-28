# 📋 INSTRUCCIONES PARA CONFIGURAR BASE DE DATOS

## ✅ Rama: `database-stable`

Esta rama contiene la estructura completa y verificada de la base de datos.

---

## 🎯 OPCIÓN RECOMENDADA: Solo Estructura de Tablas

Tu compañero puede avanzar **solo con la estructura**, sin necesidad de datos de prueba.

### Paso 1: Restaurar estructura de tablas

```bash
# Ejecutar en MySQL
mysql -u root -p < macrosur_ecommerce_DB/SCHEMA_ESTRUCTURA_TABLAS.sql
```

Este archivo contiene:
- ✅ Todas las tablas (30+)
- ✅ Relaciones (Foreign Keys)
- ✅ Índices
- ✅ Vistas
- ❌ Sin datos de prueba

### Paso 2: Configurar application.properties

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/macrosur_ecommerce
spring.datasource.username=root
spring.datasource.password=SU_CONTRASEÑA_AQUI
```

### Paso 3: Ejecutar backend

```bash
cd macrosur-ecommerce-backend
./mvnw spring-boot:run
```

**Flyway sincronizará automáticamente** su tabla de control con las migraciones V1-V6.

---

## 🔄 ALTERNATIVA: Usar Flyway desde cero

Si prefiere que Flyway construya la BD automáticamente:

### Paso 1: Crear base de datos vacía

```sql
CREATE DATABASE IF NOT EXISTS macrosur_ecommerce 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_0900_ai_ci;
```

### Paso 2: Ejecutar backend

```bash
cd macrosur-ecommerce-backend
./mvnw spring-boot:run
```

Flyway ejecutará automáticamente:
- V1__baseline.sql → Crea todas las tablas
- V2__add_destacado_column_to_productos.sql
- V3__add_activo_to_productos.sql
- V4__add_imagen_url_to_productos.sql
- V5__add_imagen_tipo_column.sql
- V6__add_oauth_columns_to_clientes.sql

---

## 📊 Verificar que funcionó

```sql
-- Verificar migraciones aplicadas
SELECT version, description, installed_on 
FROM flyway_schema_history 
ORDER BY installed_rank;

-- Debería mostrar versiones 1 a 6

-- Verificar tablas creadas
SHOW TABLES;

-- Debería mostrar 30+ tablas
```

---

## 📝 Tablas Principales Creadas

### Seguridad (4 tablas)
- `roles`
- `permisos`
- `rol_permiso`
- `usuarios_admin`

### Catálogo (7 tablas)
- `productos`
- `categorias`
- `producto_categoria`
- `atributos`
- `valores_atributo`
- `producto_atributo`
- `variantes_producto`

### Clientes (5 tablas)
- `clientes`
- `direcciones_envio`
- `metodos_pago`
- `resenas_producto`
- `reclamaciones`

### Inventario (8 tablas)
- `ubicaciones_inventario`
- `inventarios`
- `movimientos_stock`
- `alarmas_stock`
- `proveedores`
- `ordenes_reposicion`
- `detalle_orden_reposicion`
- `stock_consignado`

### Ventas (6 tablas)
- `pedidos`
- `detalle_pedido`
- `transacciones_pago`
- `seguimiento_despacho`
- `operadores_logisticos`
- `promociones`

### Otros (3 tablas)
- `contenido_informativo`
- `imagenes_producto`
- `producto_promocion`

---

## ⚠️ IMPORTANTE

### ✅ PUEDES HACER:
- Agregar datos de prueba manualmente
- Crear consultas SELECT para verificar
- Usar MySQL Workbench para explorar tablas

### ❌ NO HAGAS:
- Modificar archivos V1__*.sql a V6__*.sql (son migraciones aplicadas)
- Ejecutar scripts sueltos de `macrosur_ecommerce_DB/` sin consultar
- Hacer cambios a la estructura sin crear migración

---

## 🐛 Solución de Problemas

### Error: "Table 'X' already exists"
**Causa**: Ya tienes tablas de versiones anteriores

**Solución**:
```sql
DROP DATABASE macrosur_ecommerce;
CREATE DATABASE macrosur_ecommerce;
```
Luego vuelve a ejecutar el Paso 1.

### Error: "Flyway validate failed"
**Causa**: Tu BD tiene cambios que no están en las migraciones

**Solución**: Usa OPCIÓN RECOMENDADA (restaurar schema completo)

### Verificar versión actual de BD
```sql
SELECT MAX(version) as version_actual 
FROM flyway_schema_history;
-- Debería mostrar: 6
```

---

## 🚀 Datos de Prueba (Opcional)

Si necesitas datos de ejemplo para probar:

### Usuario Admin
```sql
-- Usuario: admin@macrosur.com
-- Contraseña: admin123
SOURCE macrosur_ecommerce_DB/insert_admin_FROM_BACKUP.sql;
```

### Productos de Ejemplo
```sql
SOURCE macrosur_ecommerce_DB/insert_productos_prueba.sql;
```

---

## 📞 Contacto

Si tienes problemas:
1. Verifica que MySQL esté corriendo
2. Verifica la conexión en `application.properties`
3. Revisa los logs del backend (Spring Boot)
4. Contacta a Rodrigo si nada funciona

---

## 📌 Resumen Rápido

```bash
# Opción más rápida (estructura completa):
mysql -u root -p < macrosur_ecommerce_DB/SCHEMA_ESTRUCTURA_TABLAS.sql
cd macrosur-ecommerce-backend
./mvnw spring-boot:run

# Listo ✅
```

**Tu base de datos estará lista para trabajar en 2 minutos.**
