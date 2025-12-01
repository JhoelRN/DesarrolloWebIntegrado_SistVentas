# GUÍA RÁPIDA: Activar Enfoque Híbrido de Inventario

## ✅ Pasos de Implementación

### 1️⃣ Preparar Base de Datos (OBLIGATORIO)
```sql
-- Opción A: Desde MySQL Workbench o CLI
source d:\RODRIGO\DesarrolloWebIntegrado_SistVentas\macrosur_ecommerce_DB\asegurar_ubicacion_principal.sql

-- Opción B: Copiar y pegar directamente en MySQL
USE macrosur_ecommerce;

INSERT INTO ubicaciones_inventario (nombre_ubicacion, tipo_ubicacion, direccion, es_fisica, proveedor_id)
SELECT 'Tienda Principal', 'TIENDA', 'Av. Principal 123, Santiago, Chile', TRUE, NULL
WHERE NOT EXISTS (
    SELECT 1 FROM ubicaciones_inventario 
    WHERE nombre_ubicacion = 'Tienda Principal'
);
```

### 2️⃣ Compilar y Reiniciar Backend
```powershell
cd d:\RODRIGO\DesarrolloWebIntegrado_SistVentas\macrosur-ecommerce-backend
.\mvnw.cmd clean compile
.\mvnw.cmd spring-boot:run
```

### 3️⃣ Ejecutar Auto-Creación para Variantes Existentes

**Usando curl (PowerShell)**:
```powershell
$token = "TU_JWT_TOKEN_AQUI"
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:8081/api/logistica/inventario/auto-crear" `
    -Method POST `
    -Headers $headers
```

**Usando Postman/Insomnia**:
```
POST http://localhost:8081/api/logistica/inventario/auto-crear
Headers:
  Authorization: Bearer {tu_token}
```

### 4️⃣ Verificar Resultados
```sql
-- Ver inventarios creados automáticamente
SELECT 
    i.inventario_id,
    vp.sku,
    p.nombre_producto,
    i.cantidad,
    i.stock_minimo_seguridad,
    u.nombre_ubicacion
FROM inventario i
JOIN variantes_producto vp ON i.variante_id = vp.variante_id
JOIN productos p ON vp.producto_id = p.producto_id
JOIN ubicaciones_inventario u ON i.ubicacion_id = u.ubicacion_id
ORDER BY p.nombre_producto;

-- Contar variantes con/sin inventario
SELECT 
    (SELECT COUNT(*) FROM variantes_producto) AS total_variantes,
    (SELECT COUNT(DISTINCT variante_id) FROM inventario) AS variantes_con_inventario,
    (SELECT COUNT(*) FROM variantes_producto) - (SELECT COUNT(DISTINCT variante_id) FROM inventario) AS variantes_sin_inventario;
```

---

## 🎯 ¿Qué hace este enfoque?

### Automático (Para nuevas variantes)
✅ Cuando creas una variante → Se crea inventario automático con `cantidad=0`  
✅ No necesitas crear inventario manualmente  
✅ Admin solo ajusta la cantidad cuando recibe stock

### Manual (Para variantes existentes)
✅ Ejecutas endpoint `/auto-crear` una sola vez  
✅ Sistema revisa todas las variantes  
✅ Crea inventarios faltantes  
✅ Luego admin ajusta cantidades

---

## 📊 Ejemplo Práctico

### Antes (Manual - Riesgo de incongruencia)
```
Admin crea Producto "Alfombra Persa"
Admin crea Variante SKU "ALF-PERSA-001"
❌ NO HAY INVENTARIO → Error en sistema
Admin debe ir a Inventario y crear registro manualmente
```

### Después (Híbrido - Sin incongruencias)
```
Admin crea Producto "Alfombra Persa"
Admin crea Variante SKU "ALF-PERSA-001"
✅ INVENTARIO AUTO-CREADO (cantidad=0, ubicación: Tienda Principal)
Admin ve en inventario y ajusta cantidad a 15 cuando recibe stock
```

---

## 🔧 Troubleshooting Rápido

### No se crea inventario automático
- Verificar que existe "Tienda Principal" en `ubicaciones_inventario`
- Revisar logs del backend: debe aparecer mensaje "Inventario automático creado para variante SKU..."

### Endpoint retorna 401
- Token JWT inválido o expirado
- Obtener nuevo token desde `/api/auth/login`

### Endpoint retorna 403
- Usuario no tiene permisos
- Debe tener rol ADMIN o GESTOR_LOGISTICA

---

## 📝 Resumen

**Archivos Creados**:
- `VarianteProductoListener.java` - Listener JPA
- `asegurar_ubicacion_principal.sql` - Setup DB
- `ENFOQUE_HIBRIDO_INVENTARIO.md` - Documentación completa
- `GUIA_RAPIDA_HIBRIDO.md` - Esta guía

**Archivos Modificados**:
- `VarianteProducto.java` - Agregado `@EntityListeners`
- `ProductoService.java` - Métodos auto-creación
- `InventarioController.java` - Endpoint `/auto-crear`

**Estado**: ✅ Listo para usar

---

**Próximo paso**: Ejecutar paso 1 (asegurar ubicación principal) y reiniciar backend
