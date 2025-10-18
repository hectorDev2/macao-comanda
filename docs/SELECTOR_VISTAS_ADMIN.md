# 🎛️ Selector de Vistas para Admin

## 📋 Descripción

Se agregó un selector en el Navbar que permite al usuario **admin** cambiar rápidamente entre las diferentes vistas del dashboard sin necesidad de navegar manualmente.

## ✨ Funcionalidad

### 🔐 Solo para Admin
- El selector **solo aparece** cuando:
  1. El usuario tiene rol `admin`
  2. Está en alguna ruta `/dashboard/*`

### 🎯 Vistas disponibles
- 👨‍💼 **Admin** → `/dashboard/admin`
- 👨‍🍳 **Mesero** → `/dashboard/mesero`
- 🔥 **Cocina** → `/dashboard/cocina`

### 🎨 Características de diseño
- **Gradiente naranja-cálido** que coincide con el tema de la app
- **Icono de flecha** para indicar que es un selector
- **Hover effect** para mejor UX
- **Responsive**: Se adapta a móviles y desktop
- **Auto-detecta** la vista actual según la URL

## 🔧 Implementación Técnica

### Hooks utilizados:
- `usePathname()` - Detecta la ruta actual
- `useRouter()` - Navega entre vistas
- `useState()` - Mantiene el estado de la vista actual
- `useEffect()` - Sincroniza el selector con la URL

### Lógica:
```typescript
// Detecta automáticamente la vista desde la URL
useEffect(() => {
  if (pathname.includes("/dashboard/admin")) {
    setCurrentView("admin");
  } else if (pathname.includes("/dashboard/cocina")) {
    setCurrentView("cocina");
  } else if (pathname.includes("/dashboard/mesero")) {
    setCurrentView("mesero");
  }
}, [pathname]);

// Cambia de vista al seleccionar
const handleViewChange = (view: string) => {
  setCurrentView(view);
  router.push(`/dashboard/${view}`);
};
```

## 📱 Responsive

### Desktop:
```
[Logo] [Comanda] [Sistema de Comanda Digital] | [Selector] [email] [ADMIN] [Cerrar sesión]
```

### Mobile:
```
[Logo] [Comanda] | [Selector] [ADMIN] [Salir]
```

## 🎯 Casos de uso

### Usuario Admin:
1. Entra como `admin@local.com`
2. Ve el selector en el Navbar
3. Puede cambiar a vista de Mesero para ver cómo se ve para un mesero
4. Puede cambiar a vista de Cocina para supervisar pedidos
5. Puede volver a Admin para gestionar caja

### Usuario Mesero o Cocina:
- **No ven el selector** (no tienen permisos para cambiar vistas)

## 🔐 Seguridad

El selector es solo UI convenience. Las rutas siguen protegidas por:
- `ProtectedRoute` component
- Sistema de permisos en `useUserStore`
- Validación en cada página

Aunque un mesero intente acceder manualmente a `/dashboard/admin`, será redirigido a `/unauthorized`.

## 🎨 Personalización

Si quieres cambiar los emojis o nombres:

```tsx
<option value="admin" className="bg-white text-gray-800">
  🎯 Tu Icono Admin
</option>
```

## 🚀 Testing

1. Inicia la app: `bun run dev`
2. Login con `admin@local.com` / `123456`
3. Verifica que aparezca el selector
4. Cambia entre vistas
5. Verifica que la URL cambie correctamente
6. Logout y login con `mesero@local.com`
7. Verifica que NO aparezca el selector

## ✅ Resultado

El admin ahora tiene navegación rápida entre todas las vistas del sistema, mejorando la experiencia de supervisión y administración del restaurante.
