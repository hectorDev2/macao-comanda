"use client";

import { useUserStore } from "@/store/useUserStore";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const user = useUserStore((s) => s.user);
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [currentView, setCurrentView] = useState("");

  // Detectar la vista actual desde la URL
  useEffect(() => {
    if (pathname.includes("/dashboard/admin")) {
      setCurrentView("admin");
    } else if (pathname.includes("/dashboard/cocina")) {
      setCurrentView("cocina");
    } else if (pathname.includes("/dashboard/mesero")) {
      setCurrentView("mesero");
    }
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    router.push(`/dashboard/${view}`);
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
              {/* Selector de vistas para Admin */}
              {user.role === "admin" && pathname.includes("/dashboard") && (
                <div className="relative">
                  <select
                    value={currentView}
                    onChange={(e) => handleViewChange(e.target.value)}
                    className="appearance-none px-3 sm:px-4 py-2 pr-8 sm:pr-10 bg-gradient-to-r from-warm-500 to-warm-600 text-white rounded-lg text-xs sm:text-sm font-semibold transition-all hover:from-warm-600 hover:to-warm-700 focus:outline-none focus:ring-2 focus:ring-warm-400 cursor-pointer shadow-md"
                  >
                    <option value="admin" className="bg-white text-gray-800">
                      👨‍💼 Admin
                    </option>
                    <option value="mesero" className="bg-white text-gray-800">
                      👨‍🍳 Mesero
                    </option>
                    <option value="cocina" className="bg-white text-gray-800">
                      🔥 Cocina
                    </option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>
              )}

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
