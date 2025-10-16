# 📋 GUÍA DE MIGRACIÓN DEL MENÚ A FIREBASE

## 🎯 Objetivo
Migrar todos los productos del menú desde el archivo local `menuData.ts` a Firebase Firestore para tener un menú dinámico y actualizable en tiempo real.

---

## 🏗️ Estructura de Datos

### En el repositorio (`/mock/menuData.ts`):
```typescript
export interface MenuItem {
  name: string;
  description: string;
  price: number;
  image: string;  // Ruta a la imagen en /public
  featured?: boolean;
}

export interface MenuCategory {
  title: string;
  items: MenuItem[];
}
```

### En Firebase (colección `menu`):
Cada documento tiene la siguiente estructura:
```json
{
  "category": "Parrilla",
  "name": "Picaña",
  "description": "¡El orgullo brasileño! Jugoso corte...",
  "price": 65,
  "image": "/images/parrilla/picana.webp",
  "featured": false
}
```

---

## 📁 Archivos Involucrados

### Datos
- **`/mock/menuData.ts`**: Archivo fuente con todos los productos (66 items, 12 categorías)
- **`/public/images/`**: Carpeta con todas las imágenes de productos

### Migración
- **`/scripts/seedMenu.ts`**: Script para subir datos a Firebase

### Store
- **`/store/useMenuStore.ts`**: Zustand store que lee desde Firebase

---

## 🚀 Pasos para Migrar

### 1. Verificar Configuración de Firebase

Asegúrate de tener tu archivo `.env.local` con las credenciales:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=tu-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=tu-app-id
```

### 2. Instalar Dependencias (si es necesario)

```bash
bun install tsx
```

### 3. Ejecutar el Script de Migración

```bash
npx tsx scripts/seedMenu.ts
```

### 4. Salida Esperada

```
🔥 ============================================
🔥  MIGRACIÓN DE MENÚ A FIREBASE FIRESTORE
🔥 ============================================

📋 Verificando configuración de Firebase...
✅ Proyecto Firebase: macao-comanda-xxxxx

🧹 Limpiando colección 'menu' existente...
   Encontrados X documentos existentes
✅ Colección limpiada

📦 Preparando datos para migración...
✅ Total de items a subir: 66
   Categorías: 12
   - Parrilla: 9 items
   - Cortes Premium: 4 items
   - Alitas: 5 items
   - Pollos: 6 items
   - Pastas: 3 items
   - Refrescos: 8 items
   - Gaseosas: 8 items
   - Aguas: 3 items
   - Vinos: 4 items
   - Cervezas: 4 items
   - Cócteles: 7 items
   - Bebidas Calientes: 5 items

🚀 Subiendo datos a Firebase...
   ✓ Batch 1: 66 items subidos (Total: 66/66)

🔍 Verificando datos en Firebase...
✅ Total de documentos en Firebase: 66

📊 Distribución por categoría:
   - Parrilla: 9 items
   - Cortes Premium: 4 items
   ...

✅ ¡MIGRACIÓN COMPLETADA EXITOSAMENTE! 🎉
```

---

## 🔄 Uso del Menú desde Firebase

### En cualquier componente:

```typescript
import { useMenuStore } from "@/store/useMenuStore";
import { useEffect } from "react";

export default function MiComponente() {
  const { categories, isLoading, error, fetchMenu } = useMenuStore();

  useEffect(() => {
    fetchMenu(); // Carga inicial
  }, []);

  if (isLoading) return <div>Cargando menú...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {categories.map((category) => (
        <div key={category.title}>
          <h2>{category.title}</h2>
          {category.items.map((item) => (
            <div key={item.name}>
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <span>S/ {item.price}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

### Con suscripción en tiempo real:

```typescript
useEffect(() => {
  const unsubscribe = subscribeToMenu(); // Se actualiza automáticamente
  return () => unsubscribe(); // Limpia al desmontar
}, []);
```

---

## 📊 Datos del Menú

### Resumen:
- **Total de productos**: 66 items
- **Total de categorías**: 12
- **Productos destacados (featured)**: 5
  - Bife Premium
  - Tomahawk
  - Alitas búfalo
  - Pisco Sour

### Categorías con cantidad de items:
1. **Parrilla**: 9 items (S/ 17 - S/ 65)
2. **Cortes Premium**: 4 items (S/ 50 cada uno)
3. **Alitas**: 5 items (S/ 23 - S/ 40)
4. **Pollos**: 6 items (S/ 18 - S/ 27)
5. **Pastas**: 3 items (S/ 20 - S/ 30)
6. **Refrescos**: 8 items (S/ 4 - S/ 12)
7. **Gaseosas**: 8 items (S/ 4 - S/ 15)
8. **Aguas**: 3 items (S/ 3)
9. **Vinos**: 4 items (S/ 35 - S/ 50)
10. **Cervezas**: 4 items (S/ 10)
11. **Cócteles**: 7 items (S/ 15)
12. **Bebidas Calientes**: 5 items (S/ 4 - S/ 10)

---

## 🖼️ Gestión de Imágenes

### Ubicación
Las imágenes permanecen en el repositorio en `/public/images/`:

```
/public/images/
├── parrilla/
│   ├── picana.webp
│   ├── churrasco-parrilla.jpg
│   └── ...
├── alitas/
│   ├── Alitas BBQ.jpg
│   └── ...
├── pollos/
├── pastas/
├── refrescos/
├── gaseosas/
├── aguas/
├── vinos/
├── cervezas/
├── cocteles/
└── bebidas-calientes/
```

### En Firebase
Solo se guarda la **ruta relativa** a la imagen:
```json
{
  "image": "/images/parrilla/picana.webp"
}
```

### Next.js automáticamente sirve las imágenes desde `/public`

---

## 🔧 Actualizar el Menú

### Para agregar/modificar productos:

1. **Edita** `/mock/menuData.ts`
2. **Ejecuta** el script de migración:
   ```bash
   npx tsx scripts/seedMenu.ts
   ```
3. **El script limpia** la colección existente y sube los datos actualizados
4. **Los componentes** se actualizan automáticamente (si usan `subscribeToMenu`)

---

## ❓ Preguntas Frecuentes

### ¿Necesito eliminar la colección manualmente antes de migrar?
No, el script automáticamente limpia la colección existente antes de subir los datos nuevos.

### ¿Puedo ejecutar el script múltiples veces?
Sí, es seguro. El script siempre limpia primero y luego sube los datos frescos.

### ¿Qué pasa con las imágenes?
Las imágenes permanecen en el repositorio. Solo las rutas se guardan en Firebase.

### ¿Cómo agrego un nuevo producto?
1. Sube la imagen a `/public/images/[categoría]/`
2. Agrega el producto en `menuData.ts`
3. Ejecuta `npx tsx scripts/seedMenu.ts`

### ¿Cómo cambio el precio de un producto?
1. Edita el precio en `menuData.ts`
2. Ejecuta `npx tsx scripts/seedMenu.ts`

---

## 🔍 Verificación en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database**
4. Busca la colección **`menu`**
5. Deberías ver 66 documentos

---

## ⚠️ Solución de Problemas

### Error: "Faltan credenciales de Firebase"
- Verifica que `.env.local` exista y tenga todas las variables
- Reinicia el servidor de desarrollo después de agregar `.env.local`

### Error: "Permission denied"
- Verifica las reglas de seguridad de Firestore
- Para desarrollo, puedes usar:
  ```
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /menu/{document=**} {
        allow read: true;
        allow write: if true; // Cambia esto en producción
      }
    }
  }
  ```

### Los datos no se actualizan en la app
- Verifica que estés llamando `fetchMenu()` o `subscribeToMenu()`
- Revisa la consola del navegador para errores
- Verifica que Firebase esté inicializado correctamente

---

## 📝 Notas Importantes

- ✅ Las imágenes **NO** se suben a Firebase Storage, permanecen en el repositorio
- ✅ El script usa **batches** para manejar grandes cantidades de datos eficientemente
- ✅ La colección se **limpia automáticamente** antes de cada migración
- ✅ El store usa **real-time listeners** para actualizaciones automáticas
- ✅ Compatible con SSR (Server-Side Rendering) de Next.js

---

## 🎉 Listo!

Ahora tu menú está completamente migrado a Firebase y se actualiza en tiempo real. Cualquier cambio en Firebase se reflejará automáticamente en todas las instancias de tu aplicación conectadas.
