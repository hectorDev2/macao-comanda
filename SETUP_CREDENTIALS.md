# 🔑 Configuración de Credenciales de Firebase Admin

## 📥 Paso 1: Descargar el archivo de credenciales

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto: **macao-comanda**
3. Haz clic en el ícono de configuración ⚙️ → **Project Settings**
4. Ve a la pestaña **Service Accounts**
5. Haz clic en **Generate New Private Key**
6. Se descargará un archivo JSON (ejemplo: `macao-comanda-firebase-adminsdk-xxxxx.json`)

## 📁 Paso 2: Colocar el archivo en el proyecto

Renombra el archivo descargado a `serviceAccountKey.json` y colócalo en la **raíz del proyecto**:

```
macao-comanda/
├── app/
├── components/
├── scripts/
├── serviceAccountKey.json  ← Aquí
├── package.json
└── ...
```

**⚠️ IMPORTANTE:** Este archivo NO se subirá a Git (está en `.gitignore`)

## ✅ Paso 3: Ejecutar el script

```bash
bun run seed:users
```

## 🎯 Resultado esperado

```
🔑 Usando archivo serviceAccountKey.json
🚀 Iniciando creación de usuarios...

📝 Creando usuario: admin@local.com
✅ Usuario creado en Auth: xxx123xxx
✅ Rol guardado en Firestore: admin

📝 Creando usuario: mesero@local.com
✅ Usuario creado en Auth: yyy456yyy
✅ Rol guardado en Firestore: mesero

📝 Creando usuario: cocina@local.com
✅ Usuario creado en Auth: zzz789zzz
✅ Rol guardado en Firestore: cocina

✅ ¡Todos los usuarios fueron creados exitosamente!

📋 Resumen de usuarios:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  • admin@local.com - Rol: admin - Password: 1234
  • mesero@local.com - Rol: mesero - Password: 1234
  • cocina@local.com - Rol: cocina - Password: 1234
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔐 Permisos configurados:
  • admin@local.com → Acceso total (mesero, cocina, admin, caja)
  • mesero@local.com → Vista mesero y bebidas
  • cocina@local.com → Solo vista cocina
```

## 🔧 Métodos alternativos

### Método 2: Variable de entorno

```bash
GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json bun run seed:users
```

### Método 3: Variables de entorno en .env

Agrega estas líneas a tu archivo `.env`:

```env
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@macao-comanda.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQI...(tu clave completa)...\n-----END PRIVATE KEY-----\n"
```

## 🆘 Troubleshooting

### Error: "No se encontraron credenciales"

Verifica que:
1. El archivo `serviceAccountKey.json` esté en la raíz del proyecto
2. El nombre del archivo sea exactamente `serviceAccountKey.json`
3. El archivo tenga permisos de lectura

### Error: "Service account object must contain..."

Tu archivo JSON está corrupto o incompleto. Vuelve a descargarlo desde Firebase Console.

### Error: "Permission denied"

Verifica que tu cuenta de Firebase tenga permisos de administrador del proyecto.

## 🎉 Listo!

Una vez ejecutado el script, ya puedes:
1. Iniciar la aplicación: `bun run dev`
2. Ir a http://localhost:3000
3. Login con `admin@local.com` / `1234`
4. Probar el sistema de roles
