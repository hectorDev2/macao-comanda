# 🍽️ Sistema de Comanda Digital

Sistema de comanda digital para restaurantes en la nube, construido con **Next.js 14 (App Router)**, **TypeScript**, **Firebase/Firestore** y **Zustand**.

## 🚀 Características

- **Backend en la nube**: Toda la data en Firebase Firestore (sin necesidad de servidor propio)
- **Multi-dispositivo**: Acceso desde cualquier celular/tablet con internet
- **Tiempo real nativo**: Sincronización instantánea con `onSnapshot` de Firebase
- **Autenticación simulada** con tres roles: Mesero, Cocina y Admin
- **Vista Mesero**: Navegar menú por categorías, agregar items al pedido y enviar pedidos
- **Vista Cocina**: Ver pedidos en tiempo real y actualizar su estado (pendiente → preparando → listo)
- **Vista Admin**: Gestión de productos del menú
- **Estado global** manejado con Zustand
- **Sistema de notificaciones** automáticas
- **Diseño responsive** con tonos cálidos optimizado para móviles

## 📦 Tecnologías

- Next.js 14 (App Router)
- TypeScript
- Firebase 12.4.0 (Firestore Database)
- TailwindCSS
- Zustand (estado global)
- React 18

## 🛠️ Instalación

```bash
# 1. Instalar dependencias
npm install
# o si usas bun:
bun install

# 2. Configurar variables de entorno
# Crea un archivo .env en la raíz con tus credenciales de Firebase:
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# 3. Poblar la base de datos con datos iniciales
npm run seed:firebase
# o:
bun run seed:firebase

# 4. Ejecutar en modo desarrollo
npm run dev
# o:
bun dev
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
 ├─ useMenuStore.ts     # Store del menú (lectura desde Firestore)
 └─ usePedidosStore.ts  # Store de pedidos (escritura/lectura Firestore)

/hooks
 └─ useRealtimeSync.ts  # Hook para sincronización en tiempo real con Firebase

/lib
 └─ firebase.ts         # Inicialización de Firebase (Firestore + Auth)

/scripts
 └─ seedFirebase.ts     # Script para poblar Firestore con datos iniciales

/mock
 ├─ users.ts            # Usuarios mock (para autenticación simulada)
 └─ menuData.ts         # Datos base para seed de Firestore
```

## ⚡ Tiempo Real con Firebase

El sistema utiliza **Firebase Firestore con sincronización en tiempo real nativa**:

### Características de Tiempo Real:

1. **Hook `useRealtimeSync`**: Escucha cambios con `onSnapshot` de Firebase
2. **Notificaciones push**: Alertas automáticas cuando pedidos cambian de estado
3. **Sincronización instantánea**: Cambios visibles en tiempo real entre dispositivos
4. **Multi-dispositivo**: Funciona en múltiples celulares/tablets simultáneamente

### Flujo de Estados:
```
Pendiente → Preparando → Listo
```

### Eventos con Notificaciones:
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

1. Abre la app en 2 dispositivos diferentes (ej: celular y tablet) o 2 ventanas del navegador
2. Login en uno como mesero (`mesero@local.com`), otro como cocina (`cocina@local.com`)
3. Envía un pedido desde el mesero
4. Cambia su estado desde cocina
5. ¡Observa las notificaciones y sincronización instantánea entre dispositivos!

### Arquitectura Firebase:

```
Firestore Database
├─ menu/                    # Colección de items del menú
│  └─ [itemId]
│     ├─ name: string
│     ├─ category: string
│     ├─ price: number
│     ├─ description: string
│     ├─ imageUrl: string
│     └─ active: boolean
│
└─ pedidos/                 # Colección de pedidos
   └─ [pedidoId]
      ├─ mesa: number
      ├─ mesero: string
      ├─ status: string
      ├─ total: number
      ├─ timestamp: Timestamp
      └─ items: array
         ├─ id: string
         ├─ name: string
         ├─ quantity: number
         └─ price: number
```

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

Sistema **en producción** usando **Firebase/Firestore** como backend en la nube:

- ✅ Los datos **persisten** en Firestore (base de datos en la nube)
- ✅ La sincronización funciona entre **múltiples dispositivos** en tiempo real
- ✅ Usa **onSnapshot** de Firebase para detectar cambios automáticamente
- ✅ Las notificaciones se generan en tiempo real con cada cambio
- ✅ **Acceso desde cualquier celular/tablet** con conexión a internet
- ✅ Sin necesidad de servidor propio (serverless)

### 🔧 Tecnología de Sincronización:

```typescript
// Store de Pedidos con Firebase
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const usePedidosStore = create<PedidosStore>((set, get) => ({
  pedidos: [],
  
  // Enviar pedido a Firestore
  submitOrder: async (mesa: number, items: CartItem[]) => {
    const pedidoData = {
      mesa,
      mesero: currentUser.name,
      status: "pendiente",
      items: items,
      total: calculateTotal(items),
      timestamp: serverTimestamp(),
    };
    
    await addDoc(collection(db, "pedidos"), pedidoData);
  },
  
  // Actualizar estado en Firestore
  updateItemStatus: async (pedidoId: string, status: string) => {
    await updateDoc(doc(db, "pedidos", pedidoId), { status });
  },
}));

// Hook de sincronización en tiempo real
useEffect(() => {
  const q = query(collection(db, "pedidos"), orderBy("timestamp", "desc"));
  
  // Escuchar cambios en tiempo real
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const pedidosActualizados = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    setPedidos(pedidosActualizados);
  });
  
  return () => unsubscribe();
}, []);
```

### 🔒 Configuración de Firebase:

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar **Firestore Database**
3. Configurar reglas de seguridad (modo prueba para desarrollo):
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Solo para desarrollo
    }
  }
}
```
4. Copiar credenciales al archivo `.env`
5. Ejecutar seed para poblar datos iniciales: `npm run seed:firebase`

### 🚀 Mejoras Futuras Recomendadas:

- ⏳ Implementar autenticación real con Firebase Auth
- ⏳ Reglas de seguridad de Firestore por roles
- ⏳ Paginación en queries de pedidos
- ⏳ Índices compuestos en Firestore para queries complejas
- ⏳ Cloud Functions para lógica de negocio (cálculos, validaciones)
- ⏳ Testing (Jest, React Testing Library, Firebase Emulator)
- ⏳ PWA para instalación en dispositivos móviles
- ⏳ Modo offline con Firestore offline persistence

## 📄 Licencia

MIT
