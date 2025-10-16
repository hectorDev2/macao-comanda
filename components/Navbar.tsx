"use client";

import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const user = useUserStore((s) => s.user);
  const logout = useUserStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="navbar fixed top-0 left-0 right-0 z-50 w-full">
      <div className="max-w-7xl mx-auto  sm:px-4  flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Image
            src="/logo.png"
            alt="Logo"
            width={90}
            height={80}
            className="shrink-0"
            priority
          />
          <div className="text-lg sm:text-2xl font-bold text-warm-600 shrink-0">
            Comanda
          </div>
          <div className="hidden sm:block text-sm text-gray-500 truncate">
            Sistema de Comanda Digital
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {user && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="hidden md:inline font-medium text-sm text-gray-600 truncate max-w-[120px]">
                  {user.email}
                </span>
                <span className="px-2 py-1 bg-warm-100 text-warm-700 rounded text-xs font-semibold uppercase">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 rounded-lg text-xs sm:text-sm font-medium transition-colors"
              >
                <span className="hidden sm:inline">Cerrar sesión</span>
                <span className="sm:hidden">Salir</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
