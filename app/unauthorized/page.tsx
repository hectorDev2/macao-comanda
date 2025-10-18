"use client";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export default function UnauthorizedPage() {
  const router = useRouter();
  const { user, logout } = useUserStore();

  const handleLogout = async () => {
    logout();
    router.push("/");
  };

  const handleGoBack = () => {
    if (user?.role === "mesero") {
      router.push("/dashboard/mesero");
    } else if (user?.role === "cocina") {
      router.push("/dashboard/cocina");
    } else if (user?.role === "admin") {
      router.push("/dashboard/admin");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center card">
        <div className="mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Acceso No Autorizado
          </h1>
          <p className="text-gray-600 mb-4">
            No tienes permisos para acceder a esta página.
          </p>
          {user && (
            <p className="text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
              Usuario: <span className="font-semibold">{user.email}</span>
              <br />
              Rol: <span className="font-semibold">{user.role}</span>
            </p>
          )}
        </div>
        <div className="space-y-3">
          <button
            onClick={handleGoBack}
            className="w-full bg-warm-500 hover:bg-warm-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Volver a mi panel
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
