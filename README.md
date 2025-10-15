# 🍽️ Sistema de Comanda Digital

Prototipo funcional de un sistema de comanda digital para restaurantes construido con **Next.js 14 (App Router)**, **TypeScript**, **TailwindCSS** y **Zustand**.

## 🚀 Características

- **Autenticación simulada** con tres roles: Mesero, Cocina y Admin
- **Vista Mesero**: Navegar menú por categorías, agregar items al pedido y enviar pedidos
- **Vista Cocina**: Ver pedidos en tiempo real y actualizar su estado (pendiente → preparando → listo)
- **Vista Admin**: Gestión de productos del menú
- **Estado global** manejado con Zustand
- **Simulación de tiempo real** entre cocina y mesero
- **Sistema de notificaciones** automáticas
- **Sincronización automática** cada 10 segundos
- **Datos mock** sin necesidad de backend
- **Diseño responsive** con tonos cálidos

## 📦 Tecnologías

- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Zustand (estado global)
- React 18

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🔐 Usuarios de prueba

| Email | Password | Rol |
|-------|----------|-----|
| mesero@local.com | 1234 | Mesero |
| cocina@local.com | 1234 | Cocina |
| admin@local.com | 1234 | Admin |

## 📁 Estructura del proyecto

```
/app
 ├─ layout.tsx          # Layout principal con navbar
 ├─ page.tsx            # Página de login
 ├─ globals.css         # Estilos globales
 └─ dashboard/
     ├─ page.tsx        # Dashboard general
     ├─ mesero/         # Vista mesero
     ├─ cocina/         # Vista cocina
     └─ admin/          # Vista admin

/components
 ├─ Navbar.tsx              # Navbar con info de usuario y logout
 ├─ NotificationCenter.tsx  # Sistema de notificaciones en tiempo real
 ├─ PedidosStatusBar.tsx    # Barra de estado de pedidos
 ├─ MenuItemCard.tsx        # Card de item del menú
 ├─ PedidoCard.tsx          # Card de pedido con cambio de estado
 ├─ CategoryTabs.tsx        # Tabs de categorías
 └─ SidebarPedido.tsx       # Sidebar con pedido actual

/store
 ├─ useUserStore.ts     # Store de usuario (con logout)
 ├─ useMenuStore.ts     # Store del menú
 └─ usePedidosStore.ts  # Store de pedidos + notificaciones + sincronización

/hooks
 └─ useRealtimeSync.ts  # Hook para simulación de tiempo real

/mock
 ├─ users.ts            # Usuarios mock
 ├─ menuData.ts         # Menú mock
 └─ pedidosData.ts      # Pedidos mock
```

## � Simulación de Tiempo Real

El sistema incluye **sincronización simulada en tiempo real** sin necesidad de backend:

### Características de Tiempo Real:

1. **Hook `useRealtimeSync`**: Actualiza automáticamente cada 10 segundos
2. **Notificaciones push**: Alertas cuando pedidos cambian de estado
3. **Estado compartido**: Cambios visibles instantáneamente entre vistas
4. **Actualizaciones automáticas**: Los pedidos avanzan de estados aleatoriamente

### Flujo de Estados:
```
Pendiente → Preparando → Listo
```

### Eventos con Notificaciones:

- **Mesero envía pedido** → Notificación: "🍽️ Nuevo pedido #123 para Mesa 5"
- **Cocina cambia a "preparando"** → Notificación: "👨‍🍳 Mesa 5: Pedido en preparación"  
- **Cocina marca "listo"** → Notificación: "✅ Mesa 5: ¡Pedido listo para servir!"

### Cómo Probarlo:

1. Abre 2 ventanas del navegador lado a lado
2. Login en una como mesero (`mesero@local.com`), otra como cocina (`cocina@local.com`)
3. Envía un pedido desde mesero
4. Cambia su estado desde cocina
5. ¡Observa las notificaciones y sincronización en tiempo real!

## �💡 Funcionalidades por Rol

### 🍽️ Mesero (`/dashboard/mesero`)
- Ver menú organizado por categorías (Entradas, Platos Fuertes, Bebidas, Postres)
- Agregar items al carrito con cantidades
- **Barra de estado en tiempo real** de todos los pedidos
- **Alerta visual** cuando hay pedidos listos para servir
- Especificar número de mesa
- Enviar pedidos a cocina
- Recibir notificaciones cuando pedidos están listos

### 👨‍🍳 Cocina (`/dashboard/cocina`)
- Ver pedidos organizados por estado (Pendientes, Preparando, Listos)
- **Contadores en tiempo real** por cada estado
- Cambiar estado de pedidos con un clic
- Ver detalles completos (mesa, items, cantidades, total)
- Recibir notificaciones de nuevos pedidos automáticamente

### 👨‍💼 Admin (`/dashboard/admin`)
- Ver tabla completa de productos
- Opciones para editar/eliminar productos
- Agregar nuevos productos (simulado)

## 🎨 Diseño

- Paleta de colores cálidos (tonos naranjas)
- Cards con bordes redondeados y sombras suaves
- Navbar superior con información del usuario
- Responsive para tablet y desktop

## 🧪 Menú Incluido

El sistema incluye un menú completo con 14 productos distribuidos en 4 categorías:

- **Entradas** (3 items): Ensalada César, Sopa del día, Tequeños
- **Platos Fuertes** (4 items): Lomo Saltado, Pasta Alfredo, Pollo a la Parrilla, Arroz con Mariscos
- **Bebidas** (4 items): Limonada, Chicha Morada, Jugo de Naranja, Café Americano
- **Postres** (3 items): Torta de Chocolate, Helado Artesanal, Flan Casero

Cada producto incluye: nombre, precio, descripción e imagen de ejemplo.

## 📝 Notas Técnicas

Este es un **prototipo funcional** con sincronización real entre pestañas usando **localStorage**:

- ✅ Los datos **persisten** en localStorage (se mantienen al recargar)
- ✅ La sincronización en tiempo real funciona entre **múltiples pestañas**
- ✅ Usa **Storage Event API** del navegador para detectar cambios
- ✅ Las notificaciones se generan localmente y se muestran en tiempo real
- ✅ **Puedes abrir mesero y cocina simultáneamente** y ver los cambios

### 🔧 Tecnología de Sincronización:

```typescript
// Zustand con persist middleware
import { persist, createJSONStorage } from 'zustand/middleware'

export const usePedidosStore = create<PedidosStore>()(
  persist(
    (set, get) => ({
      pedidos: [],
      // ... rest of state
    }),
    {
      name: 'comanda-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)

// Hook de sincronización
useEffect(() => {
  // Detecta cambios en otras pestañas
  window.addEventListener('storage', handleStorageChange)
  
  // Polling para misma pestaña (1 segundo)
  const interval = setInterval(checkUpdates, 1000)
  
  return () => {
    window.removeEventListener('storage', handleStorageChange)
    clearInterval(interval)
  }
}, [])
```

### Para Producción se Recomienda:

- ✅ Implementar autenticación real (NextAuth, JWT)
- ✅ Backend con API REST o GraphQL
- ✅ Base de datos (PostgreSQL + Prisma, MongoDB)
- ✅ **WebSockets** (Socket.io) o **Server-Sent Events** para multi-dispositivo
- ✅ Validaciones y manejo de errores robusto
- ✅ Testing (Jest, React Testing Library)
- ✅ Optimizaciones de rendimiento
- ✅ Rate limiting y seguridad

## 📄 Licencia

MIT
