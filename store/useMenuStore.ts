import { create } from "zustand";
import { MenuItem, MenuCategory } from "@/mock/menuData";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface MenuStore {
  categories: MenuCategory[];
  isLoading: boolean;
  error: string | null;
  fetchMenu: () => Promise<void>;
  subscribeToMenu: () => () => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchMenu: async () => {
    console.log("📡 useMenuStore.fetchMenu() - Iniciando carga del menú...");
    set({ isLoading: true, error: null });
    try {
      const menuRef = collection(db, "menu");
      const querySnapshot = await getDocs(menuRef);

      console.log(`📡 Total documentos recibidos: ${querySnapshot.size}`);

      // Agrupar items por categoría
      const categoriesMap = new Map<string, MenuItem[]>();

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const category = data.category;

        if (!categoriesMap.has(category)) {
          categoriesMap.set(category, []);
        }

        categoriesMap.get(category)!.push({
          name: data.name,
          description: data.description,
          price: data.price,
          image: data.image,
          featured: data.featured || false,
        });
      });

      // Convertir a formato MenuCategory[]
      const categories: MenuCategory[] = Array.from(
        categoriesMap.entries()
      ).map(([title, items]) => ({
        title,
        items,
      }));

      console.log(
        `✅ Menú cargado exitosamente: ${categories.length} categorías`
      );
      categories.forEach((cat) => {
        console.log(`   📁 ${cat.title}: ${cat.items.length} items`);
      });

      set({ categories, isLoading: false });
    } catch (error) {
      console.error("❌ Error al cargar menú desde Firebase:", error);
      set({
        error: (error as Error).message,
        isLoading: false,
        categories: [],
      });
    }
  },

  subscribeToMenu: () => {
    console.log(
      "� useMenuStore.subscribeToMenu() - Iniciando suscripción en tiempo real..."
    );

    const menuRef = collection(db, "menu");

    const unsubscribe = onSnapshot(
      menuRef,
      (snapshot) => {
        console.log(
          `� Actualización en tiempo real: ${snapshot.size} documentos`
        );

        // Agrupar items por categoría
        const categoriesMap = new Map<string, MenuItem[]>();

        snapshot.forEach((doc) => {
          const data = doc.data();
          const category = data.category;

          if (!categoriesMap.has(category)) {
            categoriesMap.set(category, []);
          }

          categoriesMap.get(category)!.push({
            name: data.name,
            description: data.description,
            price: data.price,
            image: data.image,
            featured: data.featured || false,
          });
        });

        // Convertir a formato MenuCategory[]
        const categories: MenuCategory[] = Array.from(
          categoriesMap.entries()
        ).map(([title, items]) => ({
          title,
          items,
        }));

        console.log(
          `✅ Menú actualizado en tiempo real: ${categories.length} categorías`
        );
        set({ categories, isLoading: false });
      },
      (error) => {
        console.error("❌ Error en suscripción del menú:", error);
        set({ error: error.message, isLoading: false });
      }
    );

    return unsubscribe;
  },
}));
