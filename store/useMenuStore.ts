import { create } from "zustand";
import { MenuCategory } from "@/mock/menuData";

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
    set({ isLoading: true, error: null });
    try {
      const response = await fetch("/api/menu");
      if (!response.ok) throw new Error("Error al cargar el menú");

      const data = await response.json();

      // Agrupar items por categoría
      const categoriesMap = new Map<string, any[]>();
      data.forEach((item: any) => {
        if (!categoriesMap.has(item.category)) {
          categoriesMap.set(item.category, []);
        }
        categoriesMap.get(item.category)!.push({
          id: item.id,
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

      set({ categories, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
