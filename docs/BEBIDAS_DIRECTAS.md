# 🍹 Sistema de Bebidas Directas (Sin Cocina)

## 📋 Descripción

Se ha implementado un sistema para que las **bebidas embotelladas** (gaseosas, aguas, cervezas) y productos que no requieren preparación puedan ser entregados **directamente al mesero** sin pasar por la cocina.

---

## ✨ Características Implementadas

### 1. **Campo `requiresKitchen` en Items**

Cada item del menú ahora tiene un campo booleano:
- `requiresKitchen: true` → El item debe pasar por cocina (platos, refrescos preparados)
- `requiresKitchen: false` → El item NO requiere cocina (bebidas embotelladas, aguas)

### 2. **Separación Automática de Pedidos**

Cuando el mesero envía un pedido:
- Se crean **2 pedidos separados** en Firebase:
  - **Pedido para cocina** → Estado inicial: `pendiente`
  - **Pedido directo** → Estado inicial: `listo` ✅

### 3. **Indicadores Visuales**

#### En el Menú (Vista Mesero)
- Items directos muestran badge verde: **⚡ Directo**

#### En el Carrito (Sidebar)
- **Sección naranja** 🍳 → Items para cocina
- **Sección verde** ⚡ → Items de entrega inmediata
- Nota informativa cuando hay items de ambos tipos

#### En la Vista de Cocina
- Solo muestra items que requieren cocina
- Los items directos NO aparecen en el panel de cocina

#### En la Vista de Admin
- Etiquetas visuales:
  - 🍳 Cocina (items en preparación)
  - ⚡ Directo (items listos para entregar)

---

## 🔧 Migración de Datos Existentes

### Ejecutar Script de Migración

Si ya tienes datos en Firebase, ejecuta:

```bash
bun run migrate:kitchen
```

Este script:
1. Lee todos los items del menú en Firebase
2. Determina automáticamente si requieren cocina según la categoría
3. Actualiza cada item con el campo `requiresKitchen`

### Categorías Configuradas

**❌ NO requieren cocina** (entrega directa):
- Gaseosas (Coca Cola, Inca Kola, Sprite, Fanta)
- Aguas (San Luis, San Carlos, Cielo)
- Cervezas (Pilsen, Corona, Cusqueña, Heineken)
- Vinos

**✅ SÍ requieren cocina**:
- Parrilla
- Cortes Premium
- Alitas
- Pollos
- Pastas
- Refrescos preparados (Chicha morada, Maracuyá, Copoazú, Limonada)
- Cócteles
- Bebidas Calientes

---

## 📊 Flujo de Trabajo

### Escenario 1: Solo Bebidas Directas

```
Mesero selecciona: 2x Inca Kola, 1x Agua
         ↓
Envía pedido Mesa 5
         ↓
Firebase crea pedido con estado: LISTO ✅
         ↓
Mesero ve notificación: "Pedido listo para entregar"
         ↓
Cocina NO ve este pedido
         ↓
Mesero entrega directamente
```

### Escenario 2: Solo Comida

```
Mesero selecciona: 1x Lomo Saltado, 1x Alitas BBQ
         ↓
Envía pedido Mesa 5
         ↓
Firebase crea pedido con estado: PENDIENTE ⏳
         ↓
Cocina ve el pedido
         ↓
Cocina prepara y marca LISTO ✅
         ↓
Mesero ve notificación y entrega
```

### Escenario 3: Mix (Comida + Bebidas)

```
Mesero selecciona: 1x Lomo Saltado, 2x Coca Cola
         ↓
Envía pedido Mesa 5
         ↓
Firebase crea 2 pedidos:
   - Pedido A: Lomo Saltado → PENDIENTE (va a cocina)
   - Pedido B: 2x Coca Cola → LISTO (entrega directa)
         ↓
Mesero puede entregar las bebidas de inmediato
Mientras espera que cocina prepare el Lomo Saltado
```

---

## 🎯 Beneficios

✅ **Servicio más rápido** → Las bebidas se entregan inmediatamente
✅ **Cocina menos saturada** → Solo ve lo que debe preparar
✅ **Mejor experiencia** → El cliente recibe sus bebidas sin esperar
✅ **Mayor eficiencia** → Optimización del flujo de trabajo
✅ **Separación clara** → Visual y funcionalmente organizado

---

## 🔍 Validación

### Verificar que funciona correctamente:

1. **Como Mesero:**
   - Agrega bebidas al carrito
   - Verifica que aparezcan en la sección verde "⚡ Entrega Inmediata"
   - Envía el pedido
   - Deberías ver notificación: "Pedido directo listo"

2. **Como Cocina:**
   - Verifica que NO veas las bebidas embotelladas
   - Solo debes ver platos y refrescos preparados

3. **Como Admin:**
   - Verifica que veas ambos tipos de pedidos
   - Pedidos directos deben tener etiqueta verde "⚡ Directo"
   - Pedidos de cocina deben tener etiqueta naranja "🍳 Cocina"

---

## 📝 Notas Adicionales

### Agregar Nuevas Categorías

Si agregas una nueva categoría de productos:

1. **Si NO requiere cocina** (ej: postres empacados):
   ```typescript
   // En mock/menuData.ts
   {
     name: "Cheesecake empacado",
     price: 12,
     category: "Postres",
     requiresKitchen: false, // ⬅️ Agregar esto
   }
   ```

2. **Actualizar el script de migración**:
   ```typescript
   // En scripts/migrateRequiresKitchen.ts
   const DIRECT_CATEGORIES = [
     "Gaseosas",
     "Aguas",
     "Cervezas",
     "Vinos",
     "Postres", // ⬅️ Agregar aquí
   ];
   ```

### Personalización

Para cambiar el comportamiento de categorías específicas:

```typescript
// En mock/menuData.ts
{
  title: "Refrescos",
  items: [
    {
      name: "Chicha Morada (vaso)",
      requiresKitchen: true, // Requiere preparación
    },
    {
      name: "Gaseosa en lata",
      requiresKitchen: false, // Entrega directa
    }
  ]
}
```

---

## 🐛 Solución de Problemas

### Problema: Las bebidas siguen apareciendo en cocina

**Solución:**
1. Ejecuta: `bun run migrate:kitchen`
2. Verifica en Firebase Console que el campo `requiresKitchen` esté presente
3. Limpia el caché del navegador

### Problema: No se separan los pedidos

**Solución:**
1. Verifica que el campo `requiresKitchen` esté en el item del menú
2. Revisa la consola del navegador para errores
3. Verifica que el store de pedidos esté actualizado

### Problema: Items directos no aparecen como "listos"

**Solución:**
1. Verifica que el estado inicial sea `"listo"` en `submitOrder`
2. Revisa que `requiresKitchen: false` en el item del Firebase

---

## 📞 Soporte

Si necesitas ayuda adicional o encuentras algún bug, revisa:
- Console del navegador (F12)
- Firebase Console → Firestore → Colección "pedidos"
- Logs del store en `store/usePedidosStore.ts`

---

## 🚀 Próximas Mejoras Sugeridas

- [ ] Notificación sonora cuando bebidas estén listas
- [ ] Botón de confirmación de entrega para mesero
- [ ] Reporte de velocidad de servicio (bebidas vs comida)
- [ ] Dashboard con métricas de pedidos directos vs cocina
- [ ] Integración con impresora térmica separada para bar

---

**Implementado:** Octubre 2025
**Versión:** 1.0
**Estado:** ✅ Producción
