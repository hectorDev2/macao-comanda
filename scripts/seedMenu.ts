/**
 * Script para migrar los productos del menú a Firebase Firestore
 *
 * Este script toma todos los productos de menuData.ts y los sube a la colección "menu"
 * Las imágenes permanecen en el repositorio en /public/images/
 *
 * Estructura en Firebase:
 * - Colección: menu
 * - Documentos: Cada item del menú
 * - Campos: category, name, description, price, image, featured
 *
 * Uso:
 * npx tsx scripts/seedMenu.ts
 */

import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  writeBatch,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { menuCategories } from "../mock/menuData";

// Configuración de Firebase (usando las mismas variables de entorno)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function seedMenu() {
  console.log("\n🔥 ============================================");
  console.log("🔥  MIGRACIÓN DE MENÚ A FIREBASE FIRESTORE");
  console.log("🔥 ============================================\n");

  try {
    // 1. Verificar configuración
    console.log("📋 Verificando configuración de Firebase...");
    if (!firebaseConfig.projectId || !firebaseConfig.apiKey) {
      throw new Error(
        "❌ Faltan credenciales de Firebase. Verifica tu archivo .env.local"
      );
    }
    console.log(`✅ Proyecto Firebase: ${firebaseConfig.projectId}\n`);

    // 2. OPCIONAL: Limpiar colección existente
    console.log("🧹 Limpiando colección 'menu' existente...");
    const menuRef = collection(db, "menu");
    const existingDocs = await getDocs(menuRef);

    if (!existingDocs.empty) {
      console.log(`   Encontrados ${existingDocs.size} documentos existentes`);
      const deletePromises = existingDocs.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log("✅ Colección limpiada\n");
    } else {
      console.log("   No hay documentos existentes\n");
    }

    // 3. Preparar datos para migración
    console.log("📦 Preparando datos para migración...");
    const itemsToUpload: Array<{
      category: string;
      name: string;
      description: string;
      price: number;
      image: string;
      featured: boolean;
    }> = [];

    menuCategories.forEach((category) => {
      category.items.forEach((item) => {
        itemsToUpload.push({
          category: category.title,
          name: item.name,
          description: item.description,
          price: item.price,
          image: item.image,
          featured: item.featured || false,
        });
      });
    });

    console.log(`✅ Total de items a subir: ${itemsToUpload.length}`);
    console.log(`   Categorías: ${menuCategories.length}`);
    menuCategories.forEach((cat) => {
      console.log(`   - ${cat.title}: ${cat.items.length} items`);
    });
    console.log("");

    // 4. Subir datos en batches (Firestore permite máx 500 operaciones por batch)
    console.log("🚀 Subiendo datos a Firebase...");
    const batchSize = 500;
    let uploadedCount = 0;

    for (let i = 0; i < itemsToUpload.length; i += batchSize) {
      const batch = writeBatch(db);
      const batchItems = itemsToUpload.slice(i, i + batchSize);

      batchItems.forEach((item) => {
        const docRef = doc(collection(db, "menu"));
        batch.set(docRef, item);
      });

      await batch.commit();
      uploadedCount += batchItems.length;
      console.log(
        `   ✓ Batch ${Math.floor(i / batchSize) + 1}: ${
          batchItems.length
        } items subidos (Total: ${uploadedCount}/${itemsToUpload.length})`
      );
    }

    // 5. Verificar datos subidos
    console.log("\n🔍 Verificando datos en Firebase...");
    const verifySnapshot = await getDocs(menuRef);
    console.log(`✅ Total de documentos en Firebase: ${verifySnapshot.size}`);

    // Agrupar por categoría para verificación
    const categoryCounts = new Map<string, number>();
    verifySnapshot.forEach((doc) => {
      const data = doc.data();
      const count = categoryCounts.get(data.category) || 0;
      categoryCounts.set(data.category, count + 1);
    });

    console.log("\n📊 Distribución por categoría:");
    categoryCounts.forEach((count, category) => {
      console.log(`   - ${category}: ${count} items`);
    });

    console.log("\n✅ ¡MIGRACIÓN COMPLETADA EXITOSAMENTE! 🎉");
    console.log("============================================\n");

    // 6. Instrucciones finales
    console.log("📝 SIGUIENTES PASOS:");
    console.log("   1. Verifica los datos en Firebase Console");
    console.log(
      "   2. Los componentes que usen useMenuStore automáticamente cargarán desde Firebase"
    );
    console.log(
      "   3. Las imágenes se sirven desde /public/images/ (repositorio)"
    );
    console.log(
      "   4. Para actualizar el menú, modifica menuData.ts y ejecuta este script nuevamente\n"
    );

    process.exit(0);
  } catch (error) {
    console.error("\n❌ ERROR EN LA MIGRACIÓN:");
    console.error(error);
    console.error("\n💡 SOLUCIONES:");
    console.error(
      "   1. Verifica que tu archivo .env.local tenga las credenciales correctas"
    );
    console.error("   2. Asegúrate de tener permisos de escritura en Firebase");
    console.error(
      "   3. Revisa que Firebase esté correctamente configurado en tu proyecto"
    );
    console.error("   4. Verifica tu conexión a internet\n");
    process.exit(1);
  }
}

// Ejecutar migración
seedMenu();
