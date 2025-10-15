# 🧪 Guía de Prueba: Sincronización en Tiempo Real

Esta guía te mostrará paso a paso cómo probar la sincronización en tiempo real entre las vistas de Mesero y Cocina usando **múltiples pestañas del navegador**.

## 📋 Requisitos Previos

1. El servidor debe estar ejecutándose: `bun dev` o `npm run dev`
2. La aplicación debe estar disponible en `http://localhost:3000`
3. Navegador moderno (Chrome, Firefox, Safari, Edge)

## 🎬 Escenario 1: Flujo Completo Mesero → Cocina

### Paso 1: Preparar las Pestañas

1. **Abre tu navegador** y navega a `http://localhost:3000`
2. **Duplica la pestaña**:
   - **Chrome/Edge**: Clic derecho en la pestaña → "Duplicar"
   - **Firefox**: Clic derecho → "Duplicar pestaña"
   - **Safari**: Cmd + L, Cmd + C, Cmd + T, Cmd + V, Enter
   - **Atajo universal**: Cmd/Ctrl + Shift + D

### Paso 2: Login en Ambas Pestañas

**🔹 Pestaña 1 (Izquierda) - MESERO:**
```
Email: mesero@local.com
Password: 1234
```
→ Clic en "Entrar"  
→ Serás redirigido a `/dashboard/mesero`

**🔹 Pestaña 2 (Derecha) - COCINA:**
```
Email: cocina@local.com
Password: 1234
```
→ Clic en "Entrar"  
→ Serás redirigido a `/dashboard/cocina`

### Paso 3: Crear un Pedido (Vista Mesero)

**En Pestaña 1 (Mesero):**

1. Verás el menú con categorías: `Entradas`, `Platos Fuertes`, `Bebidas`, `Postres`
2. Haz clic en la categoría **"Platos Fuertes"**
3. Busca **"Lomo Saltado"** y haz clic en el botón **"Agregar"**
4. El sidebar derecho mostrará:
   ```
   Pedido Actual
   • Lomo Saltado - S/ 25.00 x 1
   Total: S/ 25.00
   ```
5. Agrega más items si quieres (ej: Chicha Morada)
6. En el campo **"Número de Mesa"** ingresa: `5`
7. Haz clic en **"Enviar Pedido"**

**✅ Resultado Inmediato:**
- Verás una notificación: **"🍽️ Nuevo pedido #[ID] para Mesa 5"**
- El carrito se vaciará
- En la barra de estado verás: **"1 Pendientes"**

### Paso 4: Ver el Pedido en Cocina

**🔁 Cambia a Pestaña 2 (Cocina):**

**✅ Sin necesidad de recargar, verás:**
- El nuevo pedido en la sección **"⏳ Pedidos Pendientes"**
- Una card con:
  ```
  Mesa: 5
  Estado: pendiente
  Items:
  • Lomo Saltado x1 - S/ 25.00
  Total: S/ 25.00
  ```
- Contador actualizado: **"⏳ Pendientes: 1"**

### Paso 5: Procesar el Pedido (Vista Cocina)

**En Pestaña 2 (Cocina):**

1. Localiza el pedido de **Mesa 5**
2. Haz clic en el botón **"Iniciar Preparación"**

**✅ Resultado:**
- El pedido se mueve a la sección **"👨‍🍳 En Preparación"**
- Notificación: **"👨‍🍳 Mesa 5: Pedido en preparación"**
- Contador actualizado: **"👨‍🍳 Preparando: 1"**

3. Espera unos segundos (simula cocinar)
4. Haz clic en **"Marcar como Listo"**

**✅ Resultado:**
- El pedido se mueve a **"✅ Listos para Servir"**
- Notificación: **"✅ Mesa 5: ¡Pedido listo para servir!"**
- Contador actualizado: **"✅ Listos: 1"**

### Paso 6: Notificación en Mesero

**🔁 Cambia a Pestaña 1 (Mesero):**

**✅ Automáticamente verás:**
- Notificación verde: **"✅ Mesa 5: ¡Pedido listo para servir!"**
- Banner pulsante en la parte superior:
  ```
  🔔 1 pedido listo para servir
  ```
- Barra de estado actualizada: **"Listos: 1"**

---

## 🎬 Escenario 2: Múltiples Pedidos Simultáneos

### Preparación
- Mantén las 2 pestañas abiertas (Mesero y Cocina)

### Flujo

**En Vista Mesero:**
1. Crea un pedido para **Mesa 3** (ej: Pasta Alfredo)
2. Crea otro pedido para **Mesa 7** (ej: Pollo a la Parrilla + Limonada)
3. Crea un tercer pedido para **Mesa 2** (ej: Ensalada César)

**En Vista Cocina:**
- ✅ Verás los 3 pedidos aparecer en **"Pendientes"** automáticamente
- Contador: **"⏳ Pendientes: 3"**

**Procesamiento:**
1. Marca Mesa 3 como **"Preparando"**
2. Marca Mesa 7 como **"Preparando"**
3. Marca Mesa 3 como **"Listo"**
4. Marca Mesa 2 como **"Preparando"**
5. Marca Mesa 7 como **"Listo"**

**En Vista Mesero:**
- ✅ Verás todas las actualizaciones en tiempo real
- ✅ Banner mostrará: **"🔔 2 pedidos listos para servir"**

---

## 🎬 Escenario 3: Verificar Persistencia

### Prueba de Recarga

1. **En cualquier pestaña**, recarga la página (F5 o Cmd/Ctrl + R)
2. **✅ Los pedidos siguen ahí** (no se pierden)
3. **✅ Los estados se mantienen** (pendiente, preparando, listo)

### Prueba de Cierre y Reapertura

1. **Cierra todas las pestañas**
2. **Abre nuevamente** `http://localhost:3000`
3. **Login** como mesero o cocina
4. **✅ Todos los pedidos anteriores siguen presentes**

### Limpiar Datos

Si quieres empezar desde cero:

1. Abre **DevTools** (F12)
2. Ve a **Application** (Chrome) o **Storage** (Firefox)
3. Click en **Local Storage** → `http://localhost:3000`
4. Busca la key: **`comanda-storage`**
5. Click derecho → **Delete**
6. Recarga la página

---

## 🐛 Solución de Problemas

### Los cambios no se sincronizan

**Verificar:**
1. ¿Ambas pestañas están en el mismo dominio? (`localhost:3000`)
2. ¿Tienes localStorage habilitado en tu navegador?
3. Abre DevTools → Application → Local Storage
4. Busca `comanda-storage`, debería tener un JSON grande

**Solución:**
- Recarga ambas pestañas
- Limpia localStorage y vuelve a intentar

### Notificaciones desaparecen muy rápido

Las notificaciones se auto-eliminan después de **5 segundos** por diseño.

### El estado no persiste al recargar

Esto NO debería pasar. Si ocurre:
1. Verifica que `zustand/middleware` esté instalado
2. Revisa la consola del navegador por errores
3. Confirma que localStorage funcione: `localStorage.setItem('test', '1')`

### Rendimiento lento con muchos pedidos

El sistema verifica cambios cada **1 segundo**. Con 50+ pedidos puede ser lento. Para producción se recomienda WebSockets.

---

## 💡 Tips para Demostración

1. **Usa ventanas lado a lado**:
   - Windows: Win + ← / Win + →
   - Mac: Arrastrar a borde de pantalla o usar Rectangle app

2. **Agrega items variados** para que sea más visual

3. **Explica el flujo** mientras lo haces:
   - "Ahora el mesero envía el pedido..."
   - "Instantáneamente aparece en cocina..."
   - "La cocina lo marca como listo..."
   - "Y el mesero recibe la notificación automáticamente"

4. **Muestra DevTools** (Application → Local Storage) para ver el JSON en tiempo real

5. **Menciona** que esto funciona sin backend, solo localStorage + Zustand

---

## 🚀 Siguientes Pasos

Este prototipo demuestra el concepto. Para un sistema real:

- ✅ **Backend**: Node.js + Express o Next.js API Routes
- ✅ **Base de datos**: PostgreSQL con Prisma ORM
- ✅ **Tiempo real multi-dispositivo**: Socket.io o Pusher
- ✅ **Autenticación**: NextAuth.js con JWT
- ✅ **Deploy**: Vercel (Frontend) + Railway (Backend)

**¿Preguntas?** Revisa el README.md principal o contacta al equipo de desarrollo.
