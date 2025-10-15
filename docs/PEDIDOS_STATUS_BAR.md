# 📊 Componente PedidosStatusBar - Guía de Uso

## Descripción

El componente **PedidosStatusBar** es una barra de estado interactiva que muestra en tiempo real la cantidad de pedidos en cada etapa del proceso. Al hacer clic en cada categoría, se despliega un modal con el detalle completo de todos los pedidos.

## 🎯 Características

### Vista Resumen
- **3 Cards Interactivos**: Pendientes, En Cocina, Listos
- **Contadores en tiempo real**: Se actualizan automáticamente
- **Indicador visual**: Punto verde pulsante indica sincronización activa
- **Hover effects**: Cambio de color al pasar el mouse
- **Click to expand**: Clic para ver detalles

### Modal de Detalle
- **Lista completa de pedidos** por categoría
- **Información de cada pedido**:
  - Número de mesa
  - Hora del pedido
  - ID del pedido
  - Lista de items con cantidades
  - Precios individuales
  - Total del pedido
- **Diseño organizado**: Cards individuales por pedido
- **Scroll interno**: Maneja muchos pedidos sin problemas
- **Cerrar**: Clic fuera del modal o botón X

## 📱 Uso en la Interfaz

### Vista Mesero

```tsx
import PedidosStatusBar from '@/components/PedidosStatusBar'

export default function MeseroPage() {
  return (
    <div>
      <h1>Vista Mesero</h1>
      <PedidosStatusBar /> {/* Aquí se muestra */}
      {/* ... resto del contenido */}
    </div>
  )
}
```

### Interacción del Usuario

1. **Ver resumen**: Los 3 cards muestran cantidades en tiempo real
2. **Clic en "Pendientes"**: Modal muestra todos los pedidos pendientes con detalles
3. **Clic en "En Cocina"**: Modal muestra pedidos en preparación
4. **Clic en "Listos"**: Modal muestra pedidos listos para servir
5. **Cerrar modal**: Clic en X o fuera del modal

## 🎨 Código de Colores

| Estado | Color | Uso |
|--------|-------|-----|
| **Pendientes** | Amarillo | Pedidos recién creados |
| **En Cocina** | Azul | Pedidos en preparación |
| **Listos** | Verde | Pedidos listos para servir |

## 💡 Ejemplo de Flujo

### Escenario: 2 Pedidos en Cocina

**Vista de Card:**
```
┌──────────────────┐
│        2         │
│   En Cocina      │
└──────────────────┘
```

**Al hacer clic, Modal muestra:**
```
┌─────────────────────────────────────┐
│  👨‍🍳 En Cocina                    × │
├─────────────────────────────────────┤
│                                     │
│  Mesa 5          14:30  #12345     │
│  ├─ 1× Lomo Saltado    S/ 25.00   │
│  ├─ 1× Chicha Morada   S/ 8.00    │
│  └─ Total:             S/ 33.00    │
│                                     │
│  Mesa 3          14:35  #12346     │
│  ├─ 1× Pasta Alfredo   S/ 20.00   │
│  ├─ 2× Limonada        S/ 12.00   │
│  └─ Total:             S/ 32.00    │
│                                     │
└─────────────────────────────────────┘
```

## 🔄 Sincronización en Tiempo Real

El componente se sincroniza automáticamente gracias a:

1. **Zustand Store**: `usePedidosStore`
2. **LocalStorage**: Persiste entre pestañas
3. **Storage Event API**: Detecta cambios en otras pestañas
4. **Polling**: Actualiza cada 1 segundo

### Prueba de Sincronización

1. Abre 2 pestañas (Mesero y Cocina)
2. En **Mesero**: Observa el contador "En Cocina"
3. En **Cocina**: Cambia un pedido de "Pendiente" a "Preparando"
4. En **Mesero**: El contador se actualiza automáticamente
5. Haz clic en "En Cocina" para ver el nuevo pedido en detalle

## 🛠️ Personalización

### Cambiar colores

Edita el componente `PedidosStatusBar.tsx`:

```tsx
// Cambiar color de "Pendientes" de amarillo a naranja
className="bg-orange-50 border-orange-200 hover:bg-orange-100"
```

### Agregar más información

En el modal, dentro del map de pedidos:

```tsx
{pedido.items.map((item, idx) => (
  <div key={idx}>
    <span>{item.quantity}× {item.name}</span>
    {/* Agregar descripción */}
    <span className="text-gray-500">{item.description}</span>
  </div>
))}
```

### Cambiar animaciones

En `globals.css`:

```css
@keyframes scaleIn {
  from {
    transform: scale(0.9) translateY(-20px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
```

## 🐛 Solución de Problemas

### El modal no se abre
- Verifica que hay pedidos en esa categoría
- Revisa la consola por errores

### Los contadores no se actualizan
- Confirma que `useRealtimeSync()` está activo en la página
- Verifica localStorage en DevTools

### Scroll no funciona
- Asegúrate de que hay más de 3-4 pedidos
- Revisa la clase `overflow-y-auto` en el modal

## 📝 Props del Componente

```typescript
// No recibe props, usa el store directamente
<PedidosStatusBar />
```

## 🚀 Mejoras Futuras

Posibles extensiones:

- [ ] Filtros por mesa
- [ ] Búsqueda de pedidos
- [ ] Ordenar por tiempo
- [ ] Imprimir ticket desde el modal
- [ ] Exportar a PDF
- [ ] Notificaciones de pedidos antiguos (> 30 min)

---

**¿Dudas?** Revisa el código en `/components/PedidosStatusBar.tsx`
