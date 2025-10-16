# 🚫 Funcionalidad: Cancelar Pedidos Pendientes

## Descripción General

Los meseros ahora pueden cancelar items de pedidos que estén en estado **"pendiente"**. Esto es útil cuando:
- El cliente cambia de opinión antes de que comience la preparación
- Se cometió un error al tomar el pedido
- El cliente cancela parte o la totalidad de su pedido

## 🎯 Características Implementadas

### 1. **Función `cancelarItem` en el Store**

**Ubicación:** `/store/usePedidosStore.ts`

```typescript
cancelarItem: async (pedidoId: number, itemId: number) => Promise<void>
```

**Flujo de Cancelación:**

```
1. Verificar que el pedido existe
   ↓
2. Verificar que el item existe
   ↓
3. Verificar que el item está en estado "pendiente"
   ├─ Si NO → Mostrar advertencia
   └─ Si SÍ → Continuar
       ↓
4. Filtrar el item del pedido
   ↓
5. Verificar items restantes
   ├─ Si quedan 0 items:
   │  └─ Eliminar pedido completo de Firebase
   │     └─ Notificar: "Pedido cancelado completamente"
   └─ Si quedan items:
      └─ Actualizar pedido en Firebase (sin el item cancelado)
         └─ Notificar: "Item X cancelado"
```

**Validaciones:**
- ✅ Solo se pueden cancelar items en estado **"pendiente"**
- ✅ Items en "preparando", "listo" o "entregado" NO se pueden cancelar
- ✅ Si se cancela el último item, se elimina el pedido completo
- ✅ Confirmación antes de cancelar (modal de confirmación)

---

### 2. **Botón de Cancelar en la Barra de Estado**

**Ubicación:** `/components/PedidosStatusBar.tsx`

**Dónde Aparece:**
- Solo en el modal de **"Items Pendientes"** (categoría amarilla)
- Botón rojo con texto "❌ Cancelar Item"
- Ubicado debajo de cada item pendiente

**Diseño:**
```
┌─────────────────────────────────┐
│ Mesa 5              Pedido #123 │
├─────────────────────────────────┤
│ 2× Lomo Saltado       S/ 50.00 │
│ S/ 25.00 c/u                    │
│ ┌─────────────────────────────┐ │
│ │   ❌ Cancelar Item          │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Características:**
- Color rojo para indicar acción destructiva
- Efecto `active:scale-95` para feedback táctil
- Transiciones suaves
- Responsive (adapta tamaño en móvil)

---

### 3. **Confirmación de Cancelación**

**Alert de Confirmación:**
```javascript
¿Seguro que deseas cancelar "Lomo Saltado"?

Esta acción no se puede deshacer.

[Cancelar] [Aceptar]
```

**Comportamiento:**
- Si el usuario hace clic en **"Cancelar"**: No pasa nada
- Si el usuario hace clic en **"Aceptar"**: Se cancela el item

---

## 📱 Flujo de Uso para el Mesero

### Escenario 1: Cancelar un Item

1. El mesero va a la vista de mesero
2. Hace clic en la categoría **"⏳ Pendientes"** en la barra de estado
3. Se abre el modal con todos los items pendientes
4. Busca el item que quiere cancelar
5. Hace clic en **"❌ Cancelar Item"**
6. Aparece confirmación
7. Confirma la cancelación
8. El item desaparece de la lista
9. Aparece notificación: `"❌ Item X cancelado de Mesa Y"`

### Escenario 2: Cancelar el Último Item (Pedido Completo)

1. El mesero sigue los pasos 1-7 del escenario anterior
2. Si era el último item del pedido:
   - El pedido completo se elimina de Firebase
   - Desaparece de todas las vistas
   - Notificación: `"🗑️ Pedido de Mesa X cancelado completamente"`
3. El modal se actualiza automáticamente

### Escenario 3: Intentar Cancelar un Item en Preparación

1. El mesero intenta cancelar un item en estado "preparando"
2. Aparece notificación de advertencia:
   ```
   ⚠️ Solo se pueden cancelar items pendientes
   ```
3. El item NO se cancela

---

## 🔒 Restricciones de Seguridad

### Estados que SE PUEDEN Cancelar:
✅ **Pendiente** - El item aún no ha comenzado a prepararse

### Estados que NO SE PUEDEN Cancelar:
❌ **Preparando** - Ya está en cocina
❌ **Listo** - Ya está terminado
❌ **Entregado** - Ya fue servido al cliente

**Razón:** Una vez que un item entra a cocina, no se debe cancelar porque:
- Ya se están usando ingredientes
- Ya se invirtió tiempo de preparación
- Podría estar casi terminado o terminado

---

## 💾 Cambios en Firebase

### Cuando se Cancela un Item:

**Caso 1: Quedan más items en el pedido**
```javascript
// ANTES
{
  mesa: "5",
  items: [
    { id: 1, name: "Lomo Saltado", estado: "pendiente" },
    { id: 2, name: "Arroz Chaufa", estado: "pendiente" }
  ]
}

// DESPUÉS (cancelar item 1)
{
  mesa: "5",
  items: [
    { id: 2, name: "Arroz Chaufa", estado: "pendiente" }
  ]
}
```

**Caso 2: Era el último item**
```javascript
// ANTES
{
  mesa: "5",
  items: [
    { id: 1, name: "Lomo Saltado", estado: "pendiente" }
  ]
}

// DESPUÉS (cancelar item 1)
// El documento completo se elimina de Firebase
```

---

## 🔔 Notificaciones

El sistema muestra diferentes notificaciones según el caso:

### Item Cancelado Exitosamente:
```
⚠️ WARNING
❌ Item Lomo Saltado cancelado de Mesa 5
```

### Pedido Completo Cancelado:
```
ℹ️ INFO
🗑️ Pedido de Mesa 5 cancelado completamente
```

### Intento de Cancelar Item No Pendiente:
```
⚠️ WARNING
Solo se pueden cancelar items pendientes
```

### Error al Cancelar:
```
⚠️ WARNING
❌ Error al cancelar: [mensaje de error]
```

---

## 🎨 Interfaz Visual

### Barra de Estado con Botón de Cancelar:

**Móvil:**
```
┌──────────────────────────────┐
│ ⏳ Items Pendientes          │
│                              │
│ ┌──────────────────────────┐ │
│ │ Mesa 5        Pedido #123│ │
│ ├──────────────────────────┤ │
│ │ 2× Lomo Saltado          │ │
│ │ S/ 50.00                 │ │
│ │                          │ │
│ │ ┌──────────────────────┐ │ │
│ │ │ ❌ Cancelar Item     │ │ │
│ │ └──────────────────────┘ │ │
│ └──────────────────────────┘ │
└──────────────────────────────┘
```

**Desktop:**
```
┌────────────────────────────────────────┐
│ ⏳ Items Pendientes                    │
│                                        │
│ ┌────────────────────────────────────┐ │
│ │ Mesa 5              Pedido #123    │ │
│ ├────────────────────────────────────┤ │
│ │ 2× Lomo Saltado       S/ 50.00    │ │
│ │ S/ 25.00 c/u                       │ │
│ │                                    │ │
│ │ ┌────────────────────────────────┐ │ │
│ │ │     ❌ Cancelar Item           │ │ │
│ │ └────────────────────────────────┘ │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

---

## 🧪 Casos de Prueba

### Test 1: Cancelar Item Único
1. Crear pedido con 1 item pendiente
2. Cancelar el item
3. **Resultado Esperado**: Pedido completo eliminado

### Test 2: Cancelar Item de Varios
1. Crear pedido con 3 items pendientes
2. Cancelar 1 item
3. **Resultado Esperado**: Quedan 2 items en el pedido

### Test 3: Cancelar Item en Preparación
1. Crear pedido con 1 item en estado "preparando"
2. Intentar cancelar
3. **Resultado Esperado**: Advertencia, item no se cancela

### Test 4: Cancelación Rechazada
1. Abrir modal de cancelación
2. Hacer clic en "Cancelar" en el alert
3. **Resultado Esperado**: Item NO se cancela

### Test 5: Sincronización en Tiempo Real
1. Usuario A crea pedido
2. Usuario B ve el pedido
3. Usuario A cancela un item
4. **Resultado Esperado**: Usuario B ve el cambio inmediatamente

---

## 🔄 Sincronización en Tiempo Real

Gracias al listener de Firebase (`onSnapshot`):

1. **Mesero A** cancela un item
   ↓
2. Firebase actualiza el documento
   ↓
3. **Todos los usuarios** con sesión activa reciben el cambio
   ↓
4. **Vista de Cocina** se actualiza automáticamente
5. **Vista de Admin** se actualiza automáticamente
6. **Otros Meseros** ven el cambio

---

## 📊 Estadísticas Afectadas

Cuando se cancela un item:

### En Barra de Estado:
- **Pendientes**: Se reduce en 1 (o desaparece si era el último)

### En Panel de Admin:
- **Total Items**: Se reduce
- **Venta Total**: Se reduce por el precio del item cancelado
- **Si se cancela todo el pedido**: La mesa desaparece

---

## ⚠️ Consideraciones Importantes

### Para el Negocio:
- ✅ Se evita preparar comida que no se va a servir
- ✅ Se reduce desperdicio de ingredientes
- ✅ Mejora la experiencia del cliente (puede cambiar de opinión)

### Para el Sistema:
- ✅ Solo afecta items pendientes (no interrumpe preparación)
- ✅ Sincronización automática con todas las vistas
- ✅ Confirmación obligatoria para evitar cancelaciones accidentales
- ✅ Notificaciones claras del resultado

### Para el Usuario (Mesero):
- ✅ Interfaz clara con botón rojo
- ✅ Confirmación antes de ejecutar
- ✅ Feedback inmediato con notificación
- ✅ Solo disponible para items que corresponde cancelar

---

## 🎯 Próximas Mejoras Sugeridas

1. **Historial de Cancelaciones**
   - Registrar qué items se cancelaron
   - Quién los canceló
   - Razón de la cancelación

2. **Restricción por Rol**
   - Solo meseros y admin pueden cancelar
   - Cocina NO puede cancelar

3. **Razón de Cancelación**
   - Campo opcional para explicar por qué se canceló
   - Útil para reportes y mejora de servicio

4. **Confirmación Doble para Pedidos Grandes**
   - Si el pedido tiene más de X items
   - Requerir confirmación adicional

5. **Notificación a Cocina**
   - Si un item ya estaba siendo visto por cocina
   - Notificar explícitamente la cancelación

---

## ✅ Checklist de Funcionalidad

- [x] Función `cancelarItem` en store
- [x] Validación de estado "pendiente"
- [x] Eliminación de item de Firebase
- [x] Eliminación de pedido completo si no quedan items
- [x] Botón de cancelar en modal de pendientes
- [x] Confirmación antes de cancelar
- [x] Notificaciones de éxito/error
- [x] Sincronización en tiempo real
- [x] Interfaz responsive
- [x] Feedback visual (scale effect)
- [x] Manejo de errores

¡La funcionalidad de cancelación de pedidos está completamente implementada y lista para usar! 🎉
