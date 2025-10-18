# 🚀 Guía Rápida: Setup de Autenticación Firebase

## ⚡ Configuración en 3 pasos

### 1️⃣ Descargar credenciales de Firebase

Ve a [Firebase Console](https://console.firebase.google.com/) → **macao-comanda** → ⚙️ **Settings** → **Service Accounts** → **Generate New Private Key**

Renombra el archivo descargado a `serviceAccountKey.json` y colócalo en la raíz del proyecto.

### 2️⃣ Crear usuarios iniciales

```bash
bun run seed:users
```

Esto creará 3 usuarios:
- `admin@local.com` (acceso total)
- `mesero@local.com` (mesero + bebidas)
- `cocina@local.com` (solo cocina)

**Contraseña para todos:** `1234`

### 3️⃣ Iniciar la app y probar

```bash
bun run dev
```

Ve a http://localhost:3000 y prueba el login.

---

## 📚 Documentación completa

- [AUTH_FIREBASE.md](./docs/AUTH_FIREBASE.md) - Sistema de autenticación completo
- [SETUP_CREDENTIALS.md](./SETUP_CREDENTIALS.md) - Guía detallada de credenciales

## 🔐 Sistema de Roles

| Usuario | Rol | Permisos |
|---------|-----|----------|
| admin@local.com | admin | **TODO** (mesero, cocina, admin, caja, bebidas) |
| mesero@local.com | mesero | mesero, bebidas |
| cocina@local.com | cocina | cocina |

## ✅ Verificar instalación

1. Login con `admin@local.com` / `1234`
2. Verifica que puedas acceder a:
   - `/dashboard/admin` ✅
   - `/dashboard/mesero` ✅
   - `/dashboard/cocina` ✅
3. Logout
4. Login con `mesero@local.com` / `1234`
5. Intenta acceder a `/dashboard/admin` → Debería redirigir a "No autorizado" ❌

## 🆘 Problemas comunes

**Error al ejecutar seed:users:**
- Verifica que `serviceAccountKey.json` esté en la raíz
- Ver [SETUP_CREDENTIALS.md](./SETUP_CREDENTIALS.md)

**No me deja entrar a una ruta:**
- Verifica que el usuario tenga el rol correcto en Firestore
- Ve a Firebase Console → Firestore → Colección `users`

**La sesión no persiste:**
- Verifica que las cookies estén habilitadas
- Revisa la consola del navegador para errores
