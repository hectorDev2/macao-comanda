# ⚡ Pasos Rápidos para Desplegar en Vercel

## 📋 Checklist Pre-Deploy

Antes de hacer push a GitHub, verifica:

```bash
# 1. Verificar que firebase-admin esté en devDependencies
cat package.json | grep "firebase-admin"
# Debe aparecer en "devDependencies", no en "dependencies"

# 2. Verificar que .env no se suba
cat .gitignore | grep ".env"
# Debe aparecer ".env" en la lista

# 3. Verificar que serviceAccountKey.json no se suba
cat .gitignore | grep "serviceAccountKey"
# Debe aparecer "serviceAccountKey.json"
```

## 🚀 Pasos para Desplegar

### 1️⃣ Push a GitHub

```bash
git add .
git commit -m "feat: sistema de autenticación con Firebase"
git push origin firebase
```

### 2️⃣ Configurar Variables en Vercel

Ve a: **Vercel Dashboard → Tu Proyecto → Settings → Environment Variables**

Agrega estas 6 variables (una por una):

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyDQAYgf4OJwV2myLsob6loIuCchrb24rbM` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `macao-comanda.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `macao-comanda` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `macao-comanda.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `687777166523` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:687777166523:web:cb4f2c28303c32bc82659e` |

**Importante:** Para cada variable, selecciona los 3 entornos:
- ✅ Production
- ✅ Preview
- ✅ Development

### 3️⃣ Redeploy

Una vez agregadas todas las variables:

1. Ve a **Deployments**
2. Click en **Redeploy** en el último deployment
3. **Desmarca** "Use existing Build Cache"
4. Click en **Redeploy**

### 4️⃣ Verificar

Una vez desplegado:
1. Ve a tu URL de Vercel
2. Intenta hacer login con: `admin@local.com` / `123456`
3. Verifica que puedas navegar entre vistas

## 🎯 Usuarios en Producción

Los usuarios YA están creados en Firebase (porque creaste usuarios localmente y Firebase es el mismo en local y producción).

Si necesitas crear más usuarios:

**Opción 1: Firebase Console (más fácil)**
```
1. Firebase Console → Authentication → Add User
2. Agrega email y password
3. Firestore → users → Add Document
4. ID del documento = UID del usuario
5. Campos: email, role, displayName
```

**Opción 2: Script local**
```bash
# Ejecutar desde tu máquina local
bun run seed:users
```

## ✅ Archivos Listos para Vercel

- ✅ `vercel.json` - Configuración de Vercel
- ✅ `next.config.js` - Optimizado para producción
- ✅ `.gitignore` - Credenciales excluidas
- ✅ `VERCEL_DEPLOYMENT.md` - Guía completa

## 🆘 Si algo falla

### Build Error: "firebase-admin not found"
- Verifica que esté en `devDependencies`
- No uses `firebase-admin` en componentes del cliente

### Runtime Error: "Firebase not initialized"
- Verifica las variables de entorno en Vercel
- Asegúrate de que no tengan espacios

### Login no funciona
- Verifica que las credenciales sean correctas
- Revisa la consola del navegador (F12)
- Verifica que Firebase Auth esté habilitado

## 📱 URL de Tu App

Una vez desplegado, tu app estará en:
```
https://macao-comanda.vercel.app
```

O tu dominio personalizado.

## 🎉 ¡Listo!

Tu aplicación con autenticación Firebase está lista para producción en Vercel.
