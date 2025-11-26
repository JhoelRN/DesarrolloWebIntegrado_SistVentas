# 🚀 REFERENCIA RÁPIDA: Control de Versiones de BD

## ⚡ Comandos Rápidos

### Extraer esquema actual desde Workbench
```powershell
cd D:\RODRIGO\DesarrolloWebIntegrado_SistVentas\macrosur_ecommerce_DB
.\extract_schema_simple.ps1          # Solo esquema
.\extract_schema_simple.ps1 -WithData # Esquema + datos
```

### Ver estado de migraciones
```sql
-- En MySQL Workbench
USE macrosur_ecommerce;
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```

### Crear nueva migración
```powershell
# 1. Crear archivo
cd D:\RODRIGO\DesarrolloWebIntegrado_SistVentas\macrosur-ecommerce-backend\src\main\resources\db\migration
New-Item "V2__descripcion.sql" -ItemType File

# 2. Editar el archivo con tu SQL
code V2__descripcion.sql

# 3. Reiniciar backend Spring Boot
# Flyway lo aplicará automáticamente
```

### Ver logs de Flyway
Busca en consola de Spring Boot:
```
INFO o.f.c.internal.command.DbMigrate - Migrating schema to version "2 - descripcion"
INFO o.f.c.internal.command.DbMigrate - Successfully applied 1 migration
```

### Rollback manual (solo desarrollo)
```sql
-- Ver última migración
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 1;

-- Eliminar registro (NO borra datos, solo el tracking)
DELETE FROM flyway_schema_history WHERE version = '2';

-- Deshacer cambios manualmente
ALTER TABLE MiTabla DROP COLUMN mi_columna;
```

### Resetear Flyway completamente (SOLO DESARROLLO)
```sql
-- ⚠️ CUIDADO: Esto borra todo el historial
DROP TABLE flyway_schema_history;
-- Reiniciar backend → Flyway reaplicará todo desde V1
```

## 📋 Patrón de Nombres

✅ CORRECTO:
- `V1__baseline.sql`
- `V2__add_stock_reservado.sql`
- `V3__create_index_productos.sql`
- `V4__alter_clientes_add_activo.sql`

❌ INCORRECTO:
- `v2__cambios.sql` (minúscula)
- `V2_cambios.sql` (solo un guión bajo)
- `V 2__cambios.sql` (espacio)
- `V02__cambios.sql` (ceros a la izquierda)

## 🔄 Flujo de Trabajo Típico

### Opción 1: Cambio desde Workbench
```
1. Workbench: ALTER TABLE ...
2. PowerShell: .\extract_schema_simple.ps1
3. VS Code: Comparar con V1__baseline.sql
4. Crear: V2__descripcion.sql (solo cambios)
5. Reiniciar backend
6. Git: commit + push
```

### Opción 2: Cambio desde código (recomendado)
```
1. Crear: V2__descripcion.sql
2. Escribir SQL en el archivo
3. Reiniciar backend → Flyway ejecuta
4. Git: commit + push
5. Compañeros: pull + reiniciar → BD sincronizada
```

## 📁 Estructura de Archivos

```
macrosur-ecommerce-backend/
└── src/main/resources/
    └── db/migration/
        ├── V1__baseline.sql        (32 tablas iniciales)
        ├── V2__add_destacado.sql   (tus cambios)
        ├── V3__create_index.sql    (tus cambios)
        └── V4__alter_table.sql     (tus cambios)
```

## 🐛 Solución de Problemas

| Error | Solución |
|-------|----------|
| `Detected failed migration` | `DELETE FROM flyway_schema_history WHERE version='X'; corregir SQL; reiniciar` |
| `Checksum mismatch` | ⚠️ NO modificar migraciones aplicadas. Crear V[N+1]__fix.sql |
| `Unknown database` | Verificar `spring.datasource.url` en `application.properties` |
| `Access denied` | Verificar `spring.datasource.username` y `password` |
| Migración no se aplica | Verificar nombre del archivo sigue patrón `V[N]__*.sql` |

## 🎯 Checklist Antes de Commit

- [ ] Archivo nombrado correctamente (`V[N]__descripcion.sql`)
- [ ] Archivo en `src/main/resources/db/migration/`
- [ ] Backend reiniciado sin errores
- [ ] Logs muestran "Successfully applied 1 migration"
- [ ] `SELECT * FROM flyway_schema_history` muestra nueva versión
- [ ] Cambios verificados en Workbench
- [ ] SQL tiene comentarios explicativos

## 📚 Documentación Completa

- **GUIA_CONTROL_VERSION_BD.md** - Guía completa con ejemplos
- **DATABASE_MIGRATION_GUIDE.md** - Guía avanzada (Docker, hosting)
- **RESUMEN_MIGRACION_BD.txt** - Resumen visual
- **macrosur_ecommerce_DB/EXTRACT_CURRENT_SCHEMA.md** - Cómo extraer esquemas

## 🔗 Enlaces Útiles

- [Flyway Documentation](https://flywaydb.org/documentation/)
- [Spring Boot + Flyway](https://docs.spring.io/spring-boot/docs/current/reference/html/howto.html#howto.data-initialization.migration-tool.flyway)
