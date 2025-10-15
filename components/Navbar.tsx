"use client";

import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="navbar sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-semibold text-warm-600">Comanda</div>
          <div className="text-sm text-gray-500">
            Sistema de Comanda Digital
          </div>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{user.email}</span>
                <span className="ml-2 px-2 py-1 bg-warm-100 text-warm-700 rounded text-xs">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
