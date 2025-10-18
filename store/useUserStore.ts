import { create } from "zustand";
import { persist } from "zustand/middleware";

// Roles del sistema
export type UserRole = "mesero" | "cocina" | "admin";

// Permisos por rol
export const rolePermissions: Record<UserRole, string[]> = {
  mesero: ["mesero", "bebidas"],
  cocina: ["cocina"],
  admin: ["mesero", "bebidas", "cocina", "admin", "caja"],
};

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  displayName?: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      loading: true,
      setUser: (user) => set({ user, loading: false }),
      setLoading: (loading) => set({ loading }),
      logout: () => set({ user: null }),
      hasPermission: (permission: string) => {
        const { user } = get();
        if (!user) return false;
        const permissions = rolePermissions[user.role] || [];
        return permissions.includes(permission);
      },
    }),
    {
      name: "user-storage",
    }
  )
);
