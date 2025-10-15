/**
 * Script para poblar Firebase con datos iniciales del menú
 * Ejecutar con: npm run seed:firebase
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { menuCategories } from '../mock/menuData';
import * as dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seedFirebase() {
  try {
    console.log("🔥 Iniciando seed de Firebase...\n");

    // Verificar si ya existen datos
    const menuRef = collection(db, "menu");
    const existing = await getDocs(menuRef);
    
    if (!existing.empty) {
      console.log("⚠️  Ya existen datos en la colección 'menu'");
      console.log(`   Encontrados: ${existing.size} items\n`);
      
      const answer = process.argv.includes('--force');
      if (!answer) {
        console.log("❌ Seed cancelado. Usa --force para sobrescribir");
        process.exit(0);
      }
      console.log("🔄 Continuando con --force...\n");
    }

    // Poblar menú
    console.log("📝 Poblando menú...");
    let itemCount = 0;

    for (const category of menuCategories) {
      for (const item of category.items) {
        await addDoc(menuRef, {
          name: item.name,
          category: category.name,
          price: item.price,
          imageUrl: item.image,
          description: item.description || "",
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        itemCount++;
        process.stdout.write(`\r   Items creados: ${itemCount}`);
      }
    }

    console.log(`\n✅ Menú poblado: ${itemCount} items creados\n`);

    console.log("🎉 Seed completado exitosamente!");
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error en seed:", error);
    process.exit(1);
  }
}

seedFirebase();
