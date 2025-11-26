# 🚀 PRUEBA DE FLYWAY - Pasos a Seguir

## ✅ PREPARACIÓN COMPLETADA:

- ✅ V1__baseline.sql creado (30 tablas + 2 vistas)
- ✅ Flyway configurado en pom.xml
- ✅ Flyway habilitado en application.properties
- ✅ Base de datos `macrosur_ecommerce` existe en MySQL Workbench

---

## 🎯 PASO 1: Iniciar el Backend

Abre una terminal en VS Code o PowerShell y ejecuta:

```powershell
cd D:\RODRIGO\DesarrolloWebIntegrado_SistVentas\macrosur-ecommerce-backend
mvn spring-boot:run
```

---

## 👀 PASO 2: Observar los Logs de Flyway

**Busca estos mensajes en la consola:**

### ✅ Logs esperados (ÉXITO):

```
INFO  o.f.c.i.database.base.BaseDatabaseType : Database: jdbc:mysql://localhost:3306/macrosur_ecommerce (MySQL 8.4)
INFO  o.f.core.internal.command.DbValidate   : Successfully validated 1 migration (execution time 00:00.015s)
INFO  o.f.c.i.s.JdbcTableSchemaHistory        : Creating Schema History table `macrosur_ecommerce`.`flyway_schema_history` ...
INFO  o.f.core.internal.command.DbMigrate     : Current version of schema `macrosur_ecommerce`: << Empty Schema >>
INFO  o.f.core.internal.command.DbMigrate     : Migrating schema `macrosur_ecommerce` to version "1 - baseline"
INFO  o.f.core.internal.command.DbMigrate     : Successfully applied 1 migration to schema `macrosur_ecommerce`, now at version v1 (execution time 00:00.234s)
```

**Significado:**
- ✅ Flyway detectó la BD vacía o sin historial
- ✅ Creó la tabla de control `flyway_schema_history`
- ✅ Ejecutó `V1__baseline.sql`
- ✅ Aplicó las 30 tablas + 2 vistas exitosamente

---

### ⚠️ Logs alternativos (BD YA TIENE TABLAS):

```
INFO  o.f.core.internal.command.DbMigrate     : Current version of schema `macrosur_ecommerce`: 0
INFO  o.f.core.internal.command.DbMigrate     : Schema `macrosur_ecommerce` is up to date. No migration necessary.
```

**Significado:**
- ⚠️ Flyway detectó que la BD ya tiene el esquema
- ⚠️ Usó `baseline-on-migrate=true` para marcarla como versión 0
- ℹ️ NO ejecutó V1__baseline.sql porque las tablas ya existen
- ✅ Esto es NORMAL si ya habías creado las tablas antes

---

### ❌ Logs de ERROR (si algo falla):

```
ERROR o.f.core.internal.command.DbMigrate    : Migration of schema `macrosur_ecommerce` to version "1 - baseline" failed!
ERROR o.f.core.Flyway                         : Validate failed: Detected failed migration to version 1 (baseline)
```

**Posibles causas:**
1. Sintaxis SQL incorrecta en V1__baseline.sql
2. Tablas ya existen y hay conflicto
3. Usuario de BD sin permisos suficientes

---

## 🔍 PASO 3: Verificar en MySQL Workbench

Después de que el backend inicie, abre MySQL Workbench y ejecuta:

```sql
USE macrosur_ecommerce;

-- Ver historial de migraciones
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```

### ✅ Resultado esperado:

| installed_rank | version | description | type | script | checksum | installed_by | installed_on | execution_time | success |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 1 | baseline | SQL | V1__baseline.sql | (número) | root | 2025-11-25 09:XX:XX | (ms) | 1 |

**Campos importantes:**
- `version`: **1** → Primera migración aplicada
- `description`: **baseline** → Tomado del nombre del archivo
- `success`: **1** → Ejecutó correctamente
- `installed_on`: Fecha/hora de ejecución

---

## 🎯 PASO 4: Verificar que las Tablas se Crearon

Si Flyway ejecutó la migración, verifica las tablas:

```sql
-- Contar tablas
SELECT COUNT(*) as total_tablas 
FROM information_schema.tables 
WHERE table_schema = 'macrosur_ecommerce' 
  AND table_type = 'BASE TABLE';
-- Debe mostrar: 31 (30 tablas + 1 flyway_schema_history)

-- Listar todas las tablas
SHOW TABLES;

-- Verificar una tabla específica
DESCRIBE usuarios_admin;
DESCRIBE variantes_producto;
```

---

## 🔄 ESCENARIOS POSIBLES:

### **Escenario A: BD Vacía (Primera Vez)**
```
1. Backend inicia
2. Flyway detecta BD sin flyway_schema_history
3. Crea flyway_schema_history
4. Ejecuta V1__baseline.sql
5. Crea las 30 tablas + 2 vistas
6. Marca versión como v1
```

### **Escenario B: BD Ya Tiene Tablas (Ya Trabajaste Antes)**
```
1. Backend inicia
2. Flyway detecta BD con tablas pero sin flyway_schema_history
3. Usa baseline-on-migrate=true
4. Crea flyway_schema_history
5. Marca versión como 0 (baseline)
6. NO ejecuta V1__baseline.sql (tablas ya existen)
7. Próximas migraciones (V2, V3...) sí se aplicarán
```

### **Escenario C: BD Ya Versionada (Segunda Ejecución)**
```
1. Backend inicia
2. Flyway detecta flyway_schema_history con versión 1
3. Compara con archivos de migración
4. NO ejecuta nada (ya está actualizado)
5. Mensaje: "Schema is up to date. No migration necessary"
```

---

## ❓ TROUBLESHOOTING

### Problema: "Table 'usuarios_admin' already exists"

**Solución 1 - Dejar Flyway baseline (RECOMENDADO):**
```
1. Flyway detectará las tablas existentes
2. Usará baseline-on-migrate=true
3. Marcará como versión 0
4. Listo, podrás usar V2, V3... para cambios futuros
```

**Solución 2 - Empezar desde cero (SOLO DESARROLLO):**
```sql
-- ⚠️ CUIDADO: Esto borra TODA la BD
DROP DATABASE macrosur_ecommerce;
CREATE DATABASE macrosur_ecommerce;
-- Reinicia backend → Flyway creará todo desde V1
```

---

### Problema: "Access denied for user 'root'@'localhost'"

**Solución:**
```properties
# Verifica en application.properties:
spring.datasource.username=root
spring.datasource.password=admin  # ← Tu contraseña correcta
```

---

### Problema: "Unknown database 'macrosur_ecommerce'"

**Solución:**
```sql
-- En MySQL Workbench:
CREATE DATABASE macrosur_ecommerce 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_0900_ai_ci;
```

---

## 📸 CAPTURAS DE ÉXITO

Cuando todo funcione, verás:

**En la consola de Spring Boot:**
```
Started MacrosurEcommerceBackendApplication in 3.456 seconds
```

**En MySQL Workbench:**
```sql
SELECT version, description, success FROM flyway_schema_history;
+----------+-------------+---------+
| version  | description | success |
+----------+-------------+---------+
|        1 | baseline    |       1 |
+----------+-------------+---------+
```

---

## 🎉 ¿QUÉ SIGUE DESPUÉS?

Una vez que Flyway funcione:

1. **Hacer un cambio de prueba**:
   ```sql
   -- Crea: V2__add_destacado_to_productos.sql
   ALTER TABLE Productos ADD COLUMN destacado TINYINT(1) DEFAULT 0;
   ```

2. **Reiniciar backend**:
   ```
   Flyway detectará V2 y lo aplicará automáticamente
   ```

3. **Verificar**:
   ```sql
   SELECT * FROM flyway_schema_history;
   -- Deberías ver versión 1 y 2
   
   DESCRIBE Productos;
   -- Deberías ver la nueva columna "destacado"
   ```

---

## 🚀 EJECUTA AHORA:

```powershell
cd D:\RODRIGO\DesarrolloWebIntegrado_SistVentas\macrosur-ecommerce-backend
mvn spring-boot:run
```

**Observa los logs de Flyway y avísame qué mensaje ves!** 👀
