# 🍽️ Sistema de Comanda Digital

Sistema profesional de comanda digital para restaurantes en la nube, construido con **Next.js 14 (App Router)**, **TypeScript**, **Firebase (Auth + Firestore)** y **Zustand**.

## ✨ Características Principales

### 🔐 Autenticación y Seguridad
- **Firebase Authentication**: Sistema completo de login con email/password
- **Control de roles**: Admin, Mesero y Cocina con permisos específicos
- **Protección de rutas**: Acceso restringido según permisos de usuario
- **Persistencia de sesión**: Login automático al regresar a la app
- **Selector de vistas para Admin**: Cambio rápido entre todas las vistas del sistema

### 🔄 Tiempo Real y Sincronización
- **Backend en la nube**: Firebase Firestore (sin servidor propio)
- **Multi-dispositivo**: Acceso simultáneo desde celulares/tablets
- **Sincronización instantánea**: `onSnapshot` de Firebase para actualizaciones en tiempo real
- **Sistema de notificaciones**: Alertas automáticas de cambios de estado

### 📱 Vistas por Rol
- **Vista Mesero**: Menú por categorías, carrito de pedidos, envío a cocina, panel de bebidas directas
- **Vista Cocina**: Gestión de pedidos (pendiente → preparando → listo)
- **Vista Admin**: Control total - caja, gestión de pagos, cierre de sesión, acceso a todas las vistas
- **Diseño responsive**: Optimizado para móviles, tablets y desktop

## 📦 Tecnologías

### Frontend
- **Next.js 14** - App Router con Server/Client Components
- **TypeScript** - Tipado estático
- **React 18** - Última versión
- **TailwindCSS** - Estilos utility-first
- **Zustand** - Estado global ligero con persistencia

### Backend & Auth
- **Firebase Authentication** - Sistema de login con email/password
- **Firestore Database** - Base de datos en tiempo real NoSQL
- **Firebase Admin SDK** - Gestión de usuarios y roles desde servidor

### DevOps & Tools
- **Vercel** - Despliegue y hosting
- **Bun** - Runtime rápido para desarrollo
- **ESLint & TypeScript** - Linting y type checking

## � Inicio Rápido

### 1️⃣ Instalación

```bash
# Clonar el repositorio
git clone https://github.com/hectorDev2/macao-comanda.git
cd macao-comanda

# Instalar dependencias
bun install
```

### 2️⃣ Configurar Firebase

**Opción A: Archivo .env (Recomendado)**
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

**Opción B: Variables en el sistema**
Ver [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) para despliegue en producción.

### 3️⃣ Configurar Base de Datos

```bash
# Poblar Firestore con el menú
bun run seed:menu
```

### 4️⃣ Crear Usuarios (Firebase Auth)

```bash
# Descargar credenciales de Firebase Admin SDK
# 1. Firebase Console → Project Settings → Service Accounts
# 2. Generate New Private Key
# 3. Guardar como serviceAccountKey.json en la raíz

# Crear usuarios iniciales
bun run seed:users
```

### 5️⃣ Ejecutar en Desarrollo

```bash
bun dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📚 Guías Completas

- [🔐 AUTH_FIREBASE.md](./docs/AUTH_FIREBASE.md) - Sistema de autenticación completo
- [🔑 SETUP_CREDENTIALS.md](./SETUP_CREDENTIALS.md) - Configurar credenciales paso a paso
- [⚡ QUICKSTART_AUTH.md](./QUICKSTART_AUTH.md) - Guía rápida de 3 pasos
- [🚀 VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Desplegar en Vercel

## 🔐 Usuarios de Prueba

Después de ejecutar `bun run seed:users`:

| Email | Password | Rol | Permisos |
|-------|----------|-----|----------|
| admin@local.com | 123456 | Admin | **Acceso total**: mesero, cocina, admin, caja, bebidas |
| mesero@local.com | 123456 | Mesero | Vista mesero y panel de bebidas |
| cocina@local.com | 123456 | Cocina | Solo vista de cocina |

### 🎛️ Selector de Vistas (Admin)

El usuario admin tiene un **selector en el Navbar** que permite cambiar rápidamente entre:
- 👨‍💼 Admin (gestión de caja y pagos)
- 👨‍🍳 Mesero (tomar pedidos)
- 🔥 Cocina (preparar pedidos)

Esto permite al administrador supervisar todas las áreas sin cambiar de cuenta.

## 📁 Estructura del Proyecto

```
macao-comanda/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Layout principal con AuthProvider
│   ├── page.tsx                  # Página de login con Firebase Auth
│   ├── unauthorized/             # Página de acceso denegado
│   └── dashboard/
│       ├── mesero/               # Vista mesero (protegida)
│       │   ├── page.tsx          # Menú y pedidos
│       │   └── bebidas/          # Panel de bebidas directas
│       ├── cocina/               # Vista cocina (protegida)
│       │   └── page.tsx          # Gestión de pedidos
│       └── admin/                # Vista admin (protegida - solo admin)
│           ├── page.tsx          # Control de caja
│           └── caja/             # Módulo de cierre de caja
│
├── components/                   # Componentes reutilizables
│   ├── Navbar.tsx                # Navbar con selector de vistas (admin)
│   ├── ProtectedRoute.tsx        # HOC para protección de rutas
│   ├── NotificationCenter.tsx    # Sistema de notificaciones
│   ├── PedidosStatusBar.tsx      # Barra de estado global
│   ├── MenuItemCard.tsx          # Card de item del menú
│   ├── PedidoCard.tsx            # Card de pedido
│   ├── CategoryTabs.tsx          # Tabs de categorías
│   └── SidebarPedido.tsx         # Carrito de pedidos
│
├── contexts/                     # Context providers
│   └── AuthContext.tsx           # Contexto de autenticación Firebase
│
├── store/                        # Zustand stores
│   ├── useUserStore.ts           # Usuario + permisos + persistencia
│   ├── useMenuStore.ts           # Menú desde Firestore
│   ├── usePedidosStore.ts        # Pedidos en tiempo real
│   ├── usePagosStore.ts          # Pagos y caja
│   └── useSesionesStore.ts       # Sesiones de caja
│
├── hooks/                        # Custom hooks
│   └── useRealtimeSync.ts        # Sincronización tiempo real Firebase
│
├── lib/                          # Configuración
│   └── firebase.ts               # Inicialización Firebase (Auth + Firestore)
│
├── scripts/                      # Scripts de utilidad
│   ├── seedMenu.ts               # Poblar menú en Firestore
│   └── seedUsers.ts              # Crear usuarios con Firebase Admin SDK
│
├── docs/                         # Documentación
│   ├── AUTH_FIREBASE.md          # Sistema de autenticación
│   ├── SELECTOR_VISTAS_ADMIN.md  # Selector de vistas
│   └── ...                       # Más guías
│
├── .env                          # Variables de entorno (no subir a Git)
├── .env.example                  # Plantilla de variables
├── serviceAccountKey.json        # Credenciales Admin SDK (no subir)
├── vercel.json                   # Configuración de Vercel
└── package.json                  # Dependencias y scripts
```

## 🏗️ Arquitectura del Sistema

### 🔐 Capa de Autenticación
```
Usuario → Firebase Auth → AuthContext → useUserStore → ProtectedRoute
```

### 📊 Flujo de Datos
```
Firestore (Cloud) ↔ useRealtimeSync ↔ Zustand Stores ↔ React Components
```

### 🎯 Sistema de Permisos
```typescript
export const rolePermissions = {
  mesero: ["mesero", "bebidas"],
  cocina: ["cocina"],
  admin: ["mesero", "bebidas", "cocina", "admin", "caja"] // Acceso total
};
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
- ✅ Ver menú completo por categorías con imágenes
- ✅ Carrito de pedidos con cantidades y totales
- ✅ Barra de estado de todos los pedidos en tiempo real
- ✅ Alerta visual cuando hay pedidos listos
- ✅ Panel de bebidas directas (acceso rápido)
- ✅ Especificar número de mesa
- ✅ Enviar pedidos a cocina
- ✅ Notificaciones automáticas de estado

**Acceso protegido**: Solo usuarios con rol `mesero` o `admin`

### 👨‍🍳 Cocina (`/dashboard/cocina`)
- ✅ Vista organizada por columnas (Pendientes | Preparando | Listos)
- ✅ Contadores en tiempo real por estado
- ✅ Cambio de estado con un solo clic
- ✅ Detalles completos de cada pedido
- ✅ Vista de items que requieren cocina vs bebidas directas
- ✅ Notificaciones de nuevos pedidos automáticas
- ✅ Diseño optimizado para tablets en cocina

**Acceso protegido**: Solo usuarios con rol `cocina` o `admin`

### 👨‍💼 Admin (`/dashboard/admin`)
- ✅ **Control de caja**: Registrar pagos por mesa
- ✅ **Cierre de caja**: Resumen de ventas por turno/sesión
- ✅ **Gestión de pagos**: Efectivo, tarjeta, transferencia
- ✅ **Vista de mesas**: Estado de consumo y cuenta pendiente
- ✅ **Historial de ventas**: Pagos realizados con filtros
- ✅ **Selector de vistas**: Cambio rápido entre mesero/cocina/admin
- ✅ **Acceso total**: Puede entrar a todas las rutas del sistema

**Acceso exclusivo**: Solo usuarios con rol `admin`

## 🎨 Diseño

- Paleta de colores cálidos (tonos naranjas)
- Cards con bordes redondeados y sombras suaves
- Navbar superior con información del usuario
- Responsive para tablet y desktop

## 🧪 Menú de Ejemplo

El sistema incluye un menú completo con categorías variadas:
- **Entradas, Platos Fuertes, Bebidas, Postres**
- **Parrilla, Cortes Premium, Alitas, Pastas, Pollos**
- **Bebidas Calientes, Cervezas, Cocteles, Vinos**

Cada item incluye:
- Nombre, categoría, precio
- Descripción detallada
- Imagen (desde `/public/images/`)
- Flag `requiresKitchen` (true/false para bebidas directas)

## 📜 Scripts Disponibles

```bash
# Desarrollo
bun dev              # Iniciar servidor de desarrollo
bun build            # Build de producción
bun start            # Iniciar servidor de producción

# Configuración inicial
bun run seed:menu    # Poblar Firestore con menú completo
bun run seed:users   # Crear usuarios con Firebase Admin SDK

# Linting
bun lint             # Verificar código con ESLint
```

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

### 🔒 Configuración de Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com)
2. Habilitar **Authentication** (Email/Password)
3. Habilitar **Firestore Database**
4. Configurar reglas de seguridad:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura solo a usuarios autenticados
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Copiar credenciales al archivo `.env`
6. Ejecutar scripts de seed

## 🚀 Despliegue en Vercel

Ver guía completa: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

**Resumen rápido:**

1. Push a GitHub
2. Conectar repositorio en Vercel
3. Configurar variables de entorno (las 6 con `NEXT_PUBLIC_`)
4. Deploy automático ✅

**Variables requeridas en Vercel:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

## 🔐 Seguridad en Producción

- ✅ Reglas de Firestore configuradas para usuarios autenticados
- ✅ Variables de entorno seguras (no en el código)
- ✅ `serviceAccountKey.json` en `.gitignore`
- ✅ Rutas protegidas con `ProtectedRoute`
- ✅ Verificación de permisos en cada acción

## 🎯 Roadmap

### ✅ Implementado
- [x] Autenticación con Firebase Auth
- [x] Control de roles y permisos
- [x] Protección de rutas
- [x] Panel de admin con caja
- [x] Selector de vistas para admin
- [x] Panel de bebidas directas
- [x] Cierre de sesión/caja
- [x] Tiempo real con Firestore

### 🚧 Próximas Mejoras
- [ ] PWA para instalación en dispositivos móviles
- [ ] Modo offline con Firestore offline persistence
- [ ] Reportes y estadísticas avanzadas
- [ ] Gestión de inventario
- [ ] Sistema de reservas de mesas
- [ ] Integración con impresoras térmicas
- [ ] App móvil nativa (React Native)
- [ ] Testing automatizado (Jest, Cypress)

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Documentación Adicional

- [AUTH_FIREBASE.md](./docs/AUTH_FIREBASE.md) - Sistema de autenticación completo
- [SELECTOR_VISTAS_ADMIN.md](./docs/SELECTOR_VISTAS_ADMIN.md) - Selector de vistas
- [SETUP_CREDENTIALS.md](./SETUP_CREDENTIALS.md) - Configurar credenciales
- [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) - Deploy en Vercel
- [QUICKSTART_AUTH.md](./QUICKSTART_AUTH.md) - Guía rápida

## 📧 Contacto

**Desarrollador**: Hector Dev  
**Repositorio**: [github.com/hectorDev2/macao-comanda](https://github.com/hectorDev2/macao-comanda)

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**
