"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUserStore } from "@/store/useUserStore";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const router = useRouter();
  const { user } = useUserStore();

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    if (user) {
      if (user.role === "mesero") router.push("/dashboard/mesero");
      else if (user.role === "cocina") router.push("/dashboard/cocina");
      else if (user.role === "admin") router.push("/dashboard/admin");
    }
  }, [user, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🔐 Intentando iniciar sesión con:", email);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("✅ Login exitoso:", userCredential.user.email);

      // El AuthProvider se encargará de obtener el rol y redirigir
      // No necesitamos hacer nada más aquí
    } catch (err: any) {
      console.error("❌ Error en login:", err);

      // Mensajes de error más amigables
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Credenciales inválidas. Verifica tu email y contraseña.");
      } else if (err.code === "auth/user-not-found") {
        setError("No existe un usuario con este email.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Demasiados intentos fallidos. Intenta más tarde.");
      } else {
        setError("Error al iniciar sesión. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md card">
        <div className="flex flex-col items-center mb-6">
          <img src="/logo.png" alt="Logo" className="w-30 h-20 mb-4" />
          <h1 className="text-2xl sm:text-3xl font-bold text-warm-600 mb-2">
            Comanda
          </h1>
          <p className="text-sm text-gray-600">Iniciar sesión con Firebase</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="border-2 p-3 sm:p-4 rounded-lg text-base focus:border-warm-500 focus:outline-none transition-colors"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            className="border-2 p-3 sm:p-4 rounded-lg text-base focus:border-warm-500 focus:outline-none transition-colors"
            placeholder="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-warm-500 hover:bg-warm-600 text-white py-3 sm:py-4 rounded-lg font-semibold text-lg transition-colors active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Iniciando sesión..." : "Entrar"}
          </button>
          {error && (
            <div className="text-red-600 bg-red-50 p-3 rounded-lg text-center font-medium">
              {error}
            </div>
          )}
        </form>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <p className="font-semibold mb-2">Usuarios de prueba:</p>
          <ul className="space-y-1 text-xs sm:text-sm">
            <li>• admin@local.com (acceso total)</li>
            <li>• mesero@local.com</li>
            <li>• cocina@local.com</li>
            <li className="text-gray-500 mt-2">Password: 123456</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
