# 📋 GUÍA VISUAL - MÓDULO DE INVENTARIO Y LOGÍSTICA
**Sistema Macrosur E-commerce**

---

## 🔐 1. LOGIN
**URL:** `http://localhost:5173/login`

**Credenciales de prueba:**
- Email: `carlos.logistics@macrosur.com`
- Password: `logistics123`

**Lo que debe pasar:**
1. Ingresa las credenciales
2. Click en "Iniciar Sesión"
3. Te redirige a `/admin/dashboard`

---

## 📊 2. PÁGINA DE INVENTARIO
**URL:** `http://localhost:5173/admin/inventory`

### **Qué debe mostrar:**

#### **Encabezado:**
- Título: "Gestión de Inventario"
- Descripción: "Administra el stock de productos en todas las ubicaciones"

#### **Tabla de Inventario** (Deberías ver ~8 items):

| SKU | Producto | Ubicación | Stock | Mínimo | Estado | Acciones |
|-----|----------|-----------|-------|--------|--------|----------|
| ZP-01-NEGRO-40 | Zapato caro | Tienda Física Macrosur | 15 | 5 | ✅ Stock OK | 🔧 Ajustar / 🔄 Transferir |
| ZP-01-NEGRO-41 | Zapato caro | Tienda Física Macrosur | 3 | 10 | ⚠️ Stock Bajo | 🔧 Ajustar / 🔄 Transferir |
| ALF001-ROJO-200x300 | Alfombra Persa Premium | Tienda Física Macrosur | 8 | 5 | ✅ Stock OK | 🔧 Ajustar / 🔄 Transferir |
| ALF001-AZUL-200x300 | Alfombra Persa Premium | Tienda Física Macrosur | 0 | 5 | 🔴 Sin Stock | 🔧 Ajustar / 🔄 Transferir |
| ALF002-GRIS-160x230 | Tapete Moderno Geométrico | Tienda Física Macrosur | 20 | 10 | ✅ Stock OK | 🔧 Ajustar / 🔄 Transferir |
| ALF003-BEIGE-200x200 | Alfombra Shaggy Suave | Tienda Física Macrosur | 4 | 8 | ⚠️ Stock Bajo | 🔧 Ajustar / 🔄 Transferir |
| ALF004-GRIS-80x200 | Tapete Pasillo Antideslizante | Tienda Física Macrosur | 6 | 3 | ✅ Stock OK | 🔧 Ajustar / 🔄 Transferir |
| ALF004-AZUL-80x200 | Tapete Pasillo Antideslizante | Tienda Física Macrosur | 12 | 5 | ✅ Stock OK | 🔧 Ajustar / 🔄 Transferir |

#### **Badges de Estado:**
- 🔴 **Sin Stock** (cantidad = 0): Fondo rojo
- ⚠️ **Stock Bajo** (cantidad < mínimo): Fondo amarillo
- ✅ **Stock OK** (cantidad >= mínimo): Fondo verde

#### **Funcionalidades:**

**A) Botón "🔧 Ajustar":**
- Click abre modal "Ajustar Inventario"
- Campos:
  - SKU: (mostrado, no editable)
  - Producto: (mostrado, no editable)
  - Ubicación: (mostrado, no editable)
  - Stock Actual: (mostrado)
  - **Cantidad Ajuste:** input número (puede ser + o -)
  - **Motivo:** textarea (ej: "Corrección de inventario", "Producto dañado")
- Botones: Cancelar / Ajustar

**B) Botón "🔄 Transferir":**
- Click abre modal "Transferir Stock"
- Campos:
  - De: Tienda Física Macrosur (mostrado)
  - **A:** Select (Almacén Central u otras ubicaciones)
  - Stock disponible: (mostrado)
  - **Cantidad:** input número
- Botones: Cancelar / Transferir

---

## ⚠️ 3. PÁGINA DE ALARMAS DE STOCK
**URL:** `http://localhost:5173/admin/logistica/alarmas`

### **Qué debe mostrar:**

#### **Encabezado:**
- Título: "🚨 Alarmas de Stock"
- Descripción: "Alertas de productos con stock crítico"

#### **Filtros:**
- [ ] Mostrar solo activas (checkbox marcado por defecto)

#### **Tabla de Alarmas** (Deberías ver ~2-3 alarmas activas):

| ID | SKU | Producto | Ubicación | Tipo | Stock | Mínimo | Fecha | Estado | Acciones |
|----|-----|----------|-----------|------|-------|--------|-------|--------|----------|
| 1 | ALF001-AZUL | Alfombra Persa Premium | Tienda Física | STOCK_CERO | 0 | 5 | 2025-11-28 | ❌ Activa | ✅ Resolver |
| 2 | ALF003-BEIGE | Alfombra Shaggy Suave | Tienda Física | STOCK_BAJO | 4 | 8 | 2025-11-28 | ❌ Activa | ✅ Resolver |
| 3 | ZP-01-NEGRO-41 | Zapato caro | Tienda Física | STOCK_BAJO | 3 | 10 | 2025-11-28 | ❌ Activa | ✅ Resolver |

#### **Tipos de Alarma:**
- 🔴 **STOCK_CERO:** Stock = 0
- ⚠️ **STOCK_BAJO:** Stock < mínimo pero > 0

#### **Botón "✅ Resolver":**
- Click abre modal "Resolver Alarma"
- Mensaje: "¿Confirmar resolución de alarma para [SKU - Producto]?"
- Botones: Cancelar / Confirmar
- **Nota:** Una alarma solo debe resolverse manualmente si hay algún problema. Normalmente se resuelven automáticamente al recibir mercancía.

---

## 📦 4. PÁGINA DE ÓRDENES DE REPOSICIÓN
**URL:** `http://localhost:5173/admin/logistica/ordenes-reposicion`

### **Qué debe mostrar:**

#### **Encabezado:**
- Título: "📦 Órdenes de Reposición"
- Descripción: "Gestiona las órdenes de compra a proveedores"
- Botón: **"+ Nueva Orden"** (derecha)

#### **Filtros de Estado:**
- [Todas] [Pendientes] [Autorizadas] [Recibidas]
- Muestra cantidad en cada filtro: Ej: "Pendientes (5)"

#### **Tabla de Órdenes** (Inicialmente deberías ver 5 órdenes pendientes):

| ID | Proveedor | Fecha Solicitud | Estado | Items | Costo Total | Fecha Recepción | Acciones |
|----|-----------|----------------|--------|-------|-------------|-----------------|----------|
| #000005 | Proveedor Textil | 2025-11-28 10:30 | 🟡 Pendiente | 2 items | $45,000 | - | ✅ Autorizar / ❌ Rechazar / 📄 PDF |
| #000004 | Importador China | 2025-11-28 09:15 | 🟡 Pendiente | 3 items | $120,500 | - | ✅ Autorizar / ❌ Rechazar / 📄 PDF |
| ... | ... | ... | ... | ... | ... | ... | ... |

#### **Estados de Orden:**
- 🟡 **Pendiente:** Esperando autorización
- 🟢 **Autorizada:** Aprobada, pendiente de recibir
- 🔴 **Rechazada:** Orden cancelada
- 🔵 **Recibida:** Mercancía recibida y stock actualizado

---

### **A) Crear Nueva Orden:**

**Click en "+ Nueva Orden"** abre modal:

**Campos del formulario:**
1. **Proveedor:** Select dropdown
   - Opciones disponibles (deberías ver 6):
     - Proveedor Alfombras Premium
     - Importador China
     - Textiles del Sur
     - Proveedora Nacional
     - Carpets International
     - Distribuidora Regional

2. **Items de la Orden:** (Tabla dinámica)
   - Botón: "+ Agregar Item"
   - Cada fila:
     - **Producto:** Select (muestra SKU - Nombre)
     - **Cantidad:** Input número
     - **[X]:** Botón eliminar fila

3. **Ejemplo de productos disponibles:**
   - ZP-01-NEGRO-40 - Zapato caro
   - ZP-01-NEGRO-41 - Zapato caro
   - ALF001-ROJO-200x300 - Alfombra Persa Premium
   - ALF001-AZUL-200x300 - Alfombra Persa Premium
   - ... (todas las variantes)

**Botones:** Cancelar / Crear Orden

---

### **B) Autorizar Orden:**

**Click en "✅ Autorizar":**
- Confirmación: "¿Autorizar esta orden de reposición?"
- Si confirma → Estado cambia a "🟢 Autorizada"
- Aparece nuevo botón: "🚚 Recibir Mercancía"

---

### **C) Descargar PDF:**

**Click en "📄 PDF":**
- Se descarga archivo: `orden_000005.pdf`
- **Contenido del PDF:**
  - Encabezado MACROSUR E-COMMERCE
  - Número de orden grande: #000005
  - Información de la empresa (dirección, teléfono, email)
  - **Información de la orden:**
    - Fecha Solicitud: DD/MM/YYYY HH:MM
    - Fecha Autorización: (si aplica)
    - Estado: Pendiente/Autorizada/etc
    - Autorizado por: (nombre del usuario)
  - **Información del proveedor:**
    - Razón Social
    - Contacto
    - Teléfono
  - **Tabla de productos:**
    | # | SKU | Producto | Cantidad | Precio Unit. | Subtotal |
    |---|-----|----------|----------|--------------|----------|
    | 1 | ALF001-AZUL | Alfombra Persa Premium | 20 | $15,000 | $300,000 |
    | 2 | ALF003-BEIGE | Alfombra Shaggy | 15 | $12,000 | $180,000 |
  - **TOTAL:** $480,000
  - **Notas:**
    - "Este documento constituye una orden de compra formal"
    - "Favor confirmar recepción y fecha estimada de entrega"
    - etc.

---

### **D) Recibir Mercancía (LA PARTE MÁS IMPORTANTE):**

**Click en "🚚 Recibir Mercancía"** (solo disponible si estado = Autorizada):

**Modal "Recibir Mercancía - Orden #000005":**

**Muestra tabla:**
| Producto | SKU | Pedido | Recibido |
|----------|-----|--------|----------|
| Alfombra Persa Premium | ALF001-AZUL | 20 | [input: 20] |
| Alfombra Shaggy Suave | ALF003-BEIGE | 15 | [input: 15] |

**Nota informativa (caja azul):**
"ℹ️ Al confirmar la recepción, el stock se actualizará automáticamente y se registrarán los movimientos en el inventario."

**Botones:** Cancelar / Confirmar Recepción

---

### **E) QUÉ PASA AL CONFIRMAR RECEPCIÓN:**

**🎯 DISTRIBUCIÓN INTELIGENTE AUTOMÁTICA:**

**Para ALF001-AZUL (20 unidades recibidas):**
- Stock actual en Tienda: 0
- Stock mínimo: 5
- **Lógica:** Stock < Mínimo → Priorizar llenar tienda
  - ✅ Envía 5 uds a **Tienda Física** (para cubrir mínimo)
  - ✅ Envía 15 uds a **Almacén Central** (resto)

**Para ALF003-BEIGE (15 unidades recibidas):**
- Stock actual en Tienda: 4
- Stock mínimo: 8
- **Lógica:** Stock < Mínimo → Priorizar llenar tienda
  - ✅ Envía 4 uds a **Tienda Física** (para llegar a 8)
  - ✅ Envía 11 uds a **Almacén Central** (resto)

**Registros creados en BD:**
1. **Inventario Tienda:**
   - ALF001-AZUL: 0 → 5 (+5)
   - ALF003-BEIGE: 4 → 8 (+4)

2. **Inventario Almacén (NUEVO):**
   - ALF001-AZUL: 0 → 15 (+15)
   - ALF003-BEIGE: 0 → 11 (+11)

3. **Movimientos creados:** 4 registros
   - Movimiento 1: ENTRADA_COMPRA +5 ALF001-AZUL Tienda
   - Movimiento 2: ENTRADA_COMPRA +15 ALF001-AZUL Almacén
   - Movimiento 3: ENTRADA_COMPRA +4 ALF003-BEIGE Tienda
   - Movimiento 4: ENTRADA_COMPRA +11 ALF003-BEIGE Almacén

4. **Alarmas resueltas:** 2 alarmas
   - Alarma de ALF001-AZUL → resuelta = true
   - Alarma de ALF003-BEIGE → resuelta = true

---

## ✅ 5. VERIFICACIÓN POST-RECEPCIÓN

### **A) Volver a Inventario:**
`http://localhost:5173/admin/inventory`

**Deberías ver NUEVOS registros:**

| SKU | Producto | Ubicación | Stock | Estado |
|-----|----------|-----------|-------|--------|
| ALF001-AZUL | Alfombra Persa Premium | Tienda Física | 5 | ✅ Stock OK |
| ALF001-AZUL | Alfombra Persa Premium | **Almacén Central** | 15 | ✅ Stock OK |
| ALF003-BEIGE | Alfombra Shaggy Suave | Tienda Física | 8 | ✅ Stock OK |
| ALF003-BEIGE | Alfombra Shaggy Suave | **Almacén Central** | 11 | ✅ Stock OK |

---

### **B) Volver a Alarmas:**
`http://localhost:5173/admin/logistica/alarmas`

**Si filtras por "Solo Activas":**
- Las alarmas de ALF001-AZUL y ALF003-BEIGE ya NO aparecen

**Si desmarcas el filtro (mostrar todas):**
- Verás las alarmas pero con estado "✅ Resuelta"
- Fecha de resolución: 2025-11-29 (fecha actual)

---

## 🚚 6. PÁGINA DE SEGUIMIENTO
**URL:** `http://localhost:5173/admin/logistica/seguimiento`

Esta página es para tracking de órdenes de CLIENTES (pedidos de e-commerce), no para órdenes de reposición.

**Qué debe mostrar:**
- Tabla de seguimientos de despacho
- Operadores logísticos (Chilexpress, Correos Chile, etc.)
- Estados: Pendiente, En Tránsito, Entregado, etc.

---

## 🎯 RESUMEN DE PRUEBA COMPLETA

### **Paso 1: Ver estado inicial**
✅ Inventario → 8 items, 3 con problemas de stock
✅ Alarmas → 3 alarmas activas
✅ Órdenes → 5 órdenes pendientes

### **Paso 2: Crear y autorizar orden**
✅ Click "+ Nueva Orden"
✅ Seleccionar proveedor
✅ Agregar ALF001-AZUL (20 uds) y ALF003-BEIGE (15 uds)
✅ Crear orden
✅ Autorizar orden

### **Paso 3: Descargar PDF**
✅ Click "PDF" → Verificar formato profesional

### **Paso 4: Recibir mercancía**
✅ Click "Recibir Mercancía"
✅ Confirmar cantidades
✅ Click "Confirmar Recepción"

### **Paso 5: Verificar distribución**
✅ Volver a Inventario
✅ Ver nuevos registros en Almacén Central
✅ Verificar stock actualizado en Tienda
✅ Volver a Alarmas → Ver alarmas resueltas

---

## 📸 ¿DÓNDE ESTÁS AHORA?

Dime en qué página estás y qué ves, para guiarte paso a paso.

**Opciones:**
1. "Estoy en login" → Te guío para ingresar
2. "Estoy en dashboard" → Te digo dónde click para ir a Inventario
3. "Estoy en Inventario" → Revisamos qué datos ves
4. "Ya estoy en X página pero veo error Y" → Debugeamos juntos

**¿En qué página estás ahora?** 🔍
