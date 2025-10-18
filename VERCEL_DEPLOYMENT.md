# 🚀 Guía de Despliegue en Vercel

## 📋 Configuración de Variables de Entorno

Para que tu aplicación funcione en Vercel, necesitas configurar las variables de entorno de Firebase.

### 🔧 Paso 1: Ir a la configuración del proyecto en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto: `macao-comanda`
3. Ve a **Settings** (Configuración)
4. Busca la sección **Environment Variables** (Variables de entorno)

### 🔑 Paso 2: Agregar las variables de Firebase

Agrega las siguientes variables con sus valores:

#### Variables del Cliente (REQUERIDAS)

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDQAYgf4OJwV2myLsob6loIuCchrb24rbM
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=macao-comanda.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=macao-comanda
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=macao-comanda.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=687777166523
NEXT_PUBLIC_FIREBASE_APP_ID=1:687777166523:web:cb4f2c28303c32bc82659e
```

### ⚙️ Paso 3: Configurar para todos los entornos

Para cada variable:
1. **Name**: Nombre de la variable (ej: `NEXT_PUBLIC_FIREBASE_API_KEY`)
2. **Value**: El valor correspondiente
3. **Environment**: Selecciona **Production**, **Preview** y **Development**
4. Click en **Add** / **Agregar**

### 🎯 Paso 4: Forzar rebuild

Una vez agregadas todas las variables:
1. Ve a la pestaña **Deployments**
2. Busca el último deployment
3. Click en los **3 puntos** (⋮)
4. Selecciona **Redeploy**
5. Marca la opción **Use existing Build Cache** (desmarcada)
6. Click en **Redeploy**

## 🔍 Verificación

### Checklist antes de desplegar:

- ✅ `.env` está en `.gitignore` (no se sube a Git)
- ✅ `serviceAccountKey.json` está en `.gitignore`
- ✅ Variables de entorno configuradas en Vercel
- ✅ `firebase-admin` está en `devDependencies` (no se despliega)

## 📝 Notas Importantes

### ⚠️ Firebase Admin SDK

El script `seedUsers.ts` **NO se ejecuta en producción**. Solo se usa localmente para crear usuarios iniciales.

Por lo tanto:
- ✅ No necesitas configurar `FIREBASE_CLIENT_EMAIL` ni `FIREBASE_PRIVATE_KEY` en Vercel
- ✅ Solo necesitas las variables con prefijo `NEXT_PUBLIC_*`

### 🔐 Crear usuarios en producción

Si necesitas crear usuarios después de desplegar:

**Opción 1: Desde Firebase Console**
1. Ve a Firebase Console → Authentication
2. Agrega usuarios manualmente
3. Luego agrega sus roles en Firestore → Collection `users`

**Opción 2: Ejecutar script localmente**
1. Conecta a tu Firebase de producción
2. Ejecuta: `bun run seed:users` desde tu máquina local
3. Los usuarios se crearán en Firebase (que es el mismo en local y producción)

## 🎉 Resultado

Tu aplicación debería desplegarse correctamente en Vercel con:
- ✅ Autenticación funcionando
- ✅ Firestore conectado
- ✅ Roles y permisos operativos

## 🆘 Troubleshooting

### Error: "Firebase not initialized"
- Verifica que todas las variables `NEXT_PUBLIC_FIREBASE_*` estén configuradas
- Asegúrate de que no tengan espacios extras
- Fuerza un rebuild

### Error: "firebase-admin not found" en build
- Esto NO debería pasar si `firebase-admin` está en `devDependencies`
- Si ocurre, verifica que no lo uses en ningún componente del cliente

### Error: "Invalid API Key"
- Verifica que copiaste correctamente las variables
- Asegúrate de que el proyecto de Firebase esté activo

## 📚 Recursos

- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Firebase + Vercel](https://vercel.com/guides/deploying-firebase-to-vercel)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
