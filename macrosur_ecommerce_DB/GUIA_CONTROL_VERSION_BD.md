# 🚀 GUÍA RÁPIDA: Sistema de Control de Versiones de Base de Datos

## ✅ ¿Qué se configuró?

### 1. **Baseline Establecido** ✅
- **Archivo**: `macrosur-ecommerce-backend/src/main/resources/db/migration/V1__baseline.sql`
- **Contenido**: Esquema completo de 32 tablas extraídas desde MySQL Workbench
- **Estado**: Este es el punto de partida oficial del proyecto

### 2. **Flyway Configurado** ✅
- Agregado en `pom.xml` (dependencias `flyway-core` y `flyway-mysql`)
- Configurado en `application.properties` con las siguientes opciones:
  - ✅ `spring.flyway.enabled=true` - Activo automáticamente
  - ✅ `spring.flyway.baseline-on-migrate=true` - Crea tabla de control si no existe
  - ✅ `spring.flyway.locations=classpath:db/migration` - Lee scripts de db/migration

---

## 📋 Workflow: Cómo hacer cambios en la Base de Datos

### **OPCIÓN A: Cambios desde MySQL Workbench (Tu método actual)**

#### Paso 1: Realiza cambios en Workbench
```sql
-- Ejemplo: Agregar columna a tabla Productos
ALTER TABLE Productos ADD COLUMN destacado TINYINT(1) DEFAULT 0;

-- Ejemplo: Crear índice
CREATE INDEX idx_codigo_producto ON Productos(codigo_producto);
```

#### Paso 2: Extrae los cambios con el script
Ejecuta desde PowerShell:
```powershell
cd D:\RODRIGO\DesarrolloWebIntegrado_SistVentas\macrosur_ecommerce_DB
.\extract_schema_simple.ps1 -WithData
```

Esto genera: `CURRENT_SCHEMA_ONLY_[timestamp].sql`

#### Paso 3: Identifica qué cambió
Compara con el baseline usando VS Code:
- Abre `V1__baseline.sql` (el original)
- Abre `CURRENT_SCHEMA_ONLY_[nuevo].sql` (el nuevo)
- **Ctrl+Shift+P** → `File: Compare Active File With...`
- Selecciona el otro archivo

#### Paso 4: Crea un archivo de migración incremental
Crea manualmente: `V2__descripcion_del_cambio.sql`

**Ubicación**: `macrosur-ecommerce-backend/src/main/resources/db/migration/`

**Nombre**: DEBE seguir el patrón: `V[numero]__[descripcion].sql`

**Ejemplos de nombres válidos**:
- `V2__add_destacado_column_to_productos.sql`
- `V3__create_index_codigo_producto.sql`
- `V4__add_stock_reservado_to_inventario.sql`

**Contenido** (solo los cambios):
```sql
-- V2__add_destacado_column_to_productos.sql
-- Agregar columna destacado a tabla Productos

ALTER TABLE Productos 
ADD COLUMN destacado TINYINT(1) DEFAULT 0 COMMENT 'Indica si el producto es destacado';

-- Crear índice para búsquedas
CREATE INDEX idx_destacado ON Productos(destacado);
```

#### Paso 5: Reinicia el backend (Spring Boot)
Flyway detectará automáticamente el nuevo archivo `V2__...sql` y lo ejecutará.

**Logs que verás**:
```
INFO  o.f.c.internal.command.DbMigrate - Current version of schema `macrosur_ecommerce`: 1
INFO  o.f.c.internal.command.DbMigrate - Migrating schema `macrosur_ecommerce` to version "2 - add destacado column to productos"
INFO  o.f.c.internal.command.DbMigrate - Successfully applied 1 migration to schema `macrosur_ecommerce`
```

---

### **OPCIÓN B: Cambios desde código (Recomendado para equipo)**

#### Paso 1: Crea el archivo de migración ANTES de modificar Workbench

**Ubicación**: `macrosur-ecommerce-backend/src/main/resources/db/migration/`

**Nombre**: `V2__add_stock_reservado.sql`

**Contenido**:
```sql
-- V2__add_stock_reservado.sql
-- Agregar columna stock_reservado para manejar pedidos pendientes

ALTER TABLE Inventario 
ADD COLUMN stock_reservado INT DEFAULT 0 
COMMENT 'Stock reservado por pedidos pendientes';

-- Actualizar stocks existentes
UPDATE Inventario SET stock_reservado = 0 WHERE stock_reservado IS NULL;
```

#### Paso 2: Reinicia el backend
Spring Boot con Flyway aplicará automáticamente el cambio a la base de datos.

#### Paso 3: (Opcional) Sincroniza con Workbench
Abre MySQL Workbench y verifica que el cambio se haya aplicado:
```sql
DESCRIBE Inventario;
-- Deberías ver la nueva columna stock_reservado
```

---

## 🔄 Sincronización con Equipo (Git + Flyway)

### Cuando TÚ haces cambios:
1. Crea la migración: `V2__mi_cambio.sql`
2. Haz commit:
   ```powershell
   git add macrosur-ecommerce-backend/src/main/resources/db/migration/V2__*.sql
   git commit -m "feat: agregar columna stock_reservado a Inventario"
   git push origin Rodrigo
   ```

### Cuando TU COMPAÑERO hace cambios:
1. Él hace pull de tu código:
   ```powershell
   git pull origin Rodrigo
   ```

2. Él reinicia su backend Spring Boot
3. **Flyway automáticamente** detecta que tiene la migración `V2` pendiente
4. **Flyway aplica** el cambio a su base de datos local
5. ¡Su base de datos queda sincronizada con la tuya!

---

## 📊 Tabla de Control: `flyway_schema_history`

Flyway crea automáticamente una tabla para trackear migraciones:

```sql
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```

**Resultado esperado**:
| installed_rank | version | description | type | script | checksum | installed_by | installed_on | execution_time | success |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | baseline | SQL | V1__baseline.sql | 123456789 | root | 2025-11-25 08:51:04 | 150 | 1 |
| 2 | 2 | add destacado column | SQL | V2__add_destacado_column.sql | 987654321 | root | 2025-11-25 09:15:22 | 45 | 1 |

---

## ❌ Errores Comunes y Soluciones

### Error: "Detected failed migration to version X"
**Causa**: Una migración falló (error SQL)

**Solución**:
```sql
-- 1. Ver qué falló
SELECT * FROM flyway_schema_history WHERE success = 0;

-- 2. Reparar manualmente (eliminar registro fallido)
DELETE FROM flyway_schema_history WHERE version = 'X';

-- 3. Corregir el SQL en VX__*.sql
-- 4. Reiniciar backend
```

### Error: "Validate failed: Migration checksum mismatch"
**Causa**: Modificaste un archivo de migración YA aplicado

**Solución**: ⚠️ **NUNCA modifiques migraciones ya aplicadas**
- Si necesitas cambiar algo, crea una **nueva migración** V3, V4, etc.
- Si es entorno de desarrollo y no hay producción:
  ```sql
  -- SOLO EN DESARROLLO - Resetear Flyway
  DROP TABLE flyway_schema_history;
  -- Reiniciar backend (volverá a aplicar todo desde V1)
  ```

### Error: "Found non-empty schema without schema history table"
**Causa**: Tienes tablas pero no está la tabla de control de Flyway

**Solución**: Ya está configurado con `baseline-on-migrate=true`, Flyway creará automáticamente la tabla.

---

## 🐳 Despliegue en Docker / Hosting

### Dockerfile (ejemplo básico)
```dockerfile
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY target/macrosur-ecommerce-backend-0.0.1-SNAPSHOT.jar app.jar

# Flyway se ejecuta automáticamente al iniciar Spring Boot
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.4
    environment:
      MYSQL_ROOT_PASSWORD: admin
      MYSQL_DATABASE: macrosur_ecommerce
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"

  backend:
    build: ./macrosur-ecommerce-backend
    depends_on:
      - mysql
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://mysql:3306/macrosur_ecommerce
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: admin
    ports:
      - "8081:8081"

volumes:
  mysql_data:
```

**Comportamiento**:
1. Contenedor `mysql` arranca con base de datos vacía
2. Contenedor `backend` arranca
3. Flyway detecta base de datos vacía
4. Flyway ejecuta automáticamente `V1__baseline.sql` → crea las 32 tablas
5. Si hay `V2, V3, V4...`, los aplica en orden
6. ¡Base de datos lista!

---

## 📝 Checklist de Cambios en Base de Datos

Antes de hacer un commit con cambios de BD, verifica:

- [ ] ¿Creaste un archivo de migración con nombre correcto? (`V[N]__descripcion.sql`)
- [ ] ¿El archivo está en `src/main/resources/db/migration/`?
- [ ] ¿Probaste que funciona? (reiniciar backend y verificar logs de Flyway)
- [ ] ¿El SQL es idempotente? (puede ejecutarse varias veces sin romper)
- [ ] ¿Agregaste comentarios claros en el SQL?
- [ ] ¿Hiciste commit del archivo de migración?

---

## 🎯 Próximos Pasos

1. **Ahora mismo**: Tu baseline `V1__baseline.sql` ya está listo
2. **Próximo cambio**: Cuando modifiques algo en Workbench, crea `V2__*.sql`
3. **Equipo**: Comparte con tu equipo que ahora usan Flyway
4. **Documentación**: Todos los cambios quedan documentados en los archivos `V*__*.sql`

---

## 📞 ¿Necesitas ayuda?

**Ver estado de migraciones**:
```sql
SELECT installed_rank, version, description, installed_on, success 
FROM flyway_schema_history 
ORDER BY installed_rank;
```

**Ver próxima migración pendiente**:
- Flyway busca archivos `V*__*.sql` con version > última aplicada
- Reinicia backend para aplicarlas

**Generar nuevo dump**:
```powershell
cd D:\RODRIGO\DesarrolloWebIntegrado_SistVentas\macrosur_ecommerce_DB
.\extract_schema_simple.ps1
```
