import { create } from "zustand";
import { MenuCategory } from "@/mock/menuData";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface MenuStore {
  categories: MenuCategory[];
  isLoading: boolean;
  error: string | null;
  fetchMenu: () => Promise<void>;
}

export const useMenuStore = create<MenuStore>((set) => ({
  categories: [],
  isLoading: false,
  error: null,

  fetchMenu: async () => {
    console.log("📡 useMenuStore.fetchMenu() - Iniciando...");
    set({ isLoading: true, error: null });
    try {
      const menuRef = collection(db, "menu");
      console.log("📡 Obteniendo todos los documentos...");
      
      // Simplificado: obtener todos los documentos sin filtros complejos
      const querySnapshot = await getDocs(menuRef);
      console.log("📡 Documentos recibidos:", querySnapshot.size);

      const data: any[] = [];
      querySnapshot.forEach((doc) => {
        const docData = { id: doc.id, ...doc.data() };
        console.log("📄 Doc:", docData);
        data.push(docData);
      });

      console.log("📊 Total items:", data.length);

      // Agrupar items por categoría
      const categoriesMap = new Map<string, any[]>();
      data.forEach((item: any) => {
        if (!categoriesMap.has(item.category)) {
          categoriesMap.set(item.category, []);
        }
        categoriesMap.get(item.category)!.push({
          id: item.id || Date.now(),
          name: item.name,
          price: item.price,
          image: item.imageUrl || "/placeholder.png",
          description: item.description || "",
        });
      });

      // Convertir a formato MenuCategory
      const categories: MenuCategory[] = Array.from(
        categoriesMap.entries()
      ).map(([name, items]) => ({ name, items }));

      console.log("✅ Categorías creadas:", categories.length, categories.map(c => `${c.name} (${c.items.length} items)`));
      set({ categories, isLoading: false });
    } catch (error) {
      console.error("❌ Error al cargar menú:", error);
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
