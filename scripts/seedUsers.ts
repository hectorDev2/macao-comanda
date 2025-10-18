/**
 * Script para crear usuarios iniciales en Firebase Auth y Firestore
 *
 * Este script:
 * 1. Crea usuarios en Firebase Auth
 * 2. Guarda sus roles en Firestore en la colección 'users'
 *
 * Ejecutar con:
 *   - Opción 1 (con archivo JSON): bun run seed:users
 *   - Opción 2 (con path): GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json bun run seed:users
 */

import {
  initializeApp,
  getApps,
  cert,
  applicationDefault,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Cargar variables de entorno
dotenv.config();

// Inicializar Firebase Admin
if (getApps().length === 0) {
  let credential;

  // Opción 1: Usar GOOGLE_APPLICATION_CREDENTIALS si está definida
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log("🔑 Usando credenciales desde GOOGLE_APPLICATION_CREDENTIALS");
    credential = applicationDefault();
  }
  // Opción 2: Buscar archivo serviceAccountKey.json en la raíz
  else if (fs.existsSync(path.join(process.cwd(), "serviceAccountKey.json"))) {
    console.log("🔑 Usando archivo serviceAccountKey.json");
    const serviceAccount = JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "serviceAccountKey.json"),
        "utf8"
      )
    );
    credential = cert(serviceAccount);
  }
  // Opción 3: Usar variables de entorno individuales
  else if (
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  ) {
    console.log("🔑 Usando variables de entorno");
    credential = cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });
  } else {
    console.error("❌ No se encontraron credenciales de Firebase Admin SDK");
    console.error("\n📋 Opciones para configurar credenciales:");
    console.error(
      "   1. Coloca el archivo serviceAccountKey.json en la raíz del proyecto"
    );
    console.error(
      "   2. Define GOOGLE_APPLICATION_CREDENTIALS=./serviceAccountKey.json"
    );
    console.error(
      "   3. Define las variables FIREBASE_CLIENT_EMAIL y FIREBASE_PRIVATE_KEY en .env"
    );
    console.error("\n💡 Descarga el archivo desde:");
    console.error(
      "   Firebase Console → Project Settings → Service Accounts → Generate New Private Key"
    );
    process.exit(1);
  }

  initializeApp({
    credential,
  });
}

const auth = getAuth();
const db = getFirestore();

// Usuarios a crear
const users = [
  {
    email: "admin@local.com",
    password: "123456",
    role: "admin" as const,
    displayName: "Administrador",
  },
  {
    email: "mesero@local.com",
    password: "123456",
    role: "mesero" as const,
    displayName: "Mesero",
  },
  {
    email: "cocina@local.com",
    password: "123456",
    role: "cocina" as const,
    displayName: "Cocina",
  },
];

async function createUser(userData: (typeof users)[0]) {
  try {
    console.log(`\n📝 Creando usuario: ${userData.email}`);

    // Intentar obtener el usuario existente
    let user;
    try {
      user = await auth.getUserByEmail(userData.email);
      console.log(`✅ Usuario ya existe: ${user.uid}`);
    } catch (error: any) {
      // Si no existe, crearlo
      if (error.code === "auth/user-not-found") {
        user = await auth.createUser({
          email: userData.email,
          password: userData.password,
          displayName: userData.displayName,
        });
        console.log(`✅ Usuario creado en Auth: ${user.uid}`);
      } else {
        throw error;
      }
    }

    // Guardar o actualizar el rol en Firestore
    await db.collection("users").doc(user.uid).set(
      {
        email: userData.email,
        role: userData.role,
        displayName: userData.displayName,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    console.log(`✅ Rol guardado en Firestore: ${userData.role}`);

    return user;
  } catch (error) {
    console.error(`❌ Error al crear usuario ${userData.email}:`, error);
    throw error;
  }
}

async function main() {
  console.log("🚀 Iniciando creación de usuarios...\n");

  try {
    for (const userData of users) {
      await createUser(userData);
    }

    console.log("\n✅ ¡Todos los usuarios fueron creados exitosamente!");
    console.log("\n📋 Resumen de usuarios:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    users.forEach((u) => {
      console.log(`  • ${u.email} - Rol: ${u.role} - Password: ${u.password}`);
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    console.log("🔐 Permisos configurados:");
    console.log(
      "  • admin@local.com → Acceso total (mesero, cocina, admin, caja)"
    );
    console.log("  • mesero@local.com → Vista mesero y bebidas");
    console.log("  • cocina@local.com → Solo vista cocina");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error fatal:", error);
    process.exit(1);
  }
}

main();
