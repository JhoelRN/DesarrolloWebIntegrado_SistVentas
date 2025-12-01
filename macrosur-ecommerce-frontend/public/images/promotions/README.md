# Imágenes para Banners de Promociones

Esta carpeta contiene las imágenes de fondo para los banners promocionales que aparecen en la página principal.

## Configuración

### Nombrar Archivos

Las imágenes deben nombrarse según el ID de la promoción en la base de datos:

```
promocion-{ID}.jpg
```

**Ejemplos:**
- `promocion-1.jpg` → Para la promoción con ID 1 (Black Friday)
- `promocion-2.jpg` → Para la promoción con ID 2 (Cyberday)
- `promocion-3.jpg` → Para envío gratis, etc.

### Especificaciones Técnicas

**Tamaño recomendado:**
- **Ancho:** 1920px (desktop) o mínimo 1200px
- **Alto:** 400px o 300px
- **Aspect Ratio:** 16:9 o 4:1

**Formatos aceptados:**
- `.jpg` (recomendado para fotos)
- `.png` (para gráficos con transparencias)
- `.webp` (mejor compresión)

**Peso del archivo:**
- **Máximo:** 500KB por imagen
- **Recomendado:** 200-300KB
- Usar herramientas de compresión: [TinyPNG](https://tinypng.com/), [Squoosh](https://squoosh.app/)

### Contenido de las Imágenes

**Qué incluir:**
- Productos relevantes de la promoción
- Colores llamativos relacionados con el tipo de oferta
- Espacio en el centro para el texto superpuesto
- Evitar texto quemado en la imagen (se agrega dinámicamente)

**Ejemplos de temas:**
- **Porcentaje:** Productos con etiquetas de precio, colores morados/azules
- **Monto Fijo:** Monedas, billetes estilizados, verde/dorado
- **2x1:** Productos duplicados, colores cian/azul
- **Envío Gratis:** Camiones, paquetes, verde/cian

### Fallback (Sin Imagen)

Si no existe la imagen personalizada, el sistema mostrará automáticamente un gradiente de color según el tipo de promoción:

- **Porcentaje:** Morado → Azul
- **Monto Fijo:** Rosa → Rojo
- **2x1:** Azul claro → Cian
- **Envío Gratis:** Verde → Cian claro

## Herramientas Recomendadas

### Para Crear/Editar Imágenes:
- [Canva](https://www.canva.com/) - Plantillas prediseñadas
- [Figma](https://www.figma.com/) - Diseño profesional
- [Photopea](https://www.photopea.com/) - Photoshop gratuito online
- [Remove.bg](https://www.remove.bg/) - Remover fondos

### Para Optimizar:
- [TinyPNG](https://tinypng.com/) - Comprimir JPG/PNG
- [Squoosh](https://squoosh.app/) - Convertir a WebP
- [ImageOptim](https://imageoptim.com/) - App para Mac

### Bancos de Imágenes Gratuitas:
- [Unsplash](https://unsplash.com/) - Fotos de alta calidad
- [Pexels](https://www.pexels.com/) - Fotos y videos gratuitos
- [Pixabay](https://pixabay.com/) - Imágenes libres de derechos

## Ejemplo de Estructura

```
public/images/promotions/
├── promocion-1.jpg  (Black Friday - 1920x400px, 250KB)
├── promocion-2.jpg  (Cyberday - 1920x400px, 280KB)
├── promocion-3.jpg  (Envío Gratis - 1920x400px, 200KB)
└── README.md        (este archivo)
```

## Cómo Agregar una Nueva Imagen

1. Crear/Descargar imagen siguiendo especificaciones
2. Renombrar como `promocion-{ID}.jpg`
3. Copiar a esta carpeta
4. Recargar la página principal (Ctrl+F5)
5. Verificar que el banner muestre la imagen

## Previsualización

Puedes verificar las imágenes en:
- **Página Principal:** http://localhost:5173/
- **Banner:** Carrusel superior (se actualiza cada 5 segundos)

## Notas Importantes

⚠️ **No eliminar imágenes en producción** sin verificar qué promociones están activas.

✅ **Mantener respaldos** de todas las imágenes originales antes de optimizar.

🎨 **Coherencia visual** - Usar colores y estilo similar entre todas las imágenes.

📱 **Responsive** - Las imágenes se adaptan automáticamente a móviles (se recortan por los lados).

## Soporte

Si tienes problemas con las imágenes:
1. Verificar nombre del archivo (debe coincidir con ID de promoción)
2. Verificar formato (JPG, PNG o WebP)
3. Verificar tamaño (no exceder 500KB)
4. Limpiar caché del navegador (Ctrl+Shift+R)
