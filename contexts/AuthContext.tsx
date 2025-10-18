"use client";
import React, { createContext, useContext, useEffect } from "react";
import { onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useUserStore, User, UserRole } from "@/store/useUserStore";

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  firebaseUser: null,
  loading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = React.useState<FirebaseUser | null>(null);
  const { setUser, setLoading, loading } = useUserStore();

  useEffect(() => {
    // Escuchar cambios en la autenticación de Firebase
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("🔐 Auth state changed:", user?.email);
      setFirebaseUser(user);

      if (user) {
        try {
          // Obtener el rol del usuario desde Firestore
          const userDoc = await getDoc(doc(db, "users", user.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userWithRole: User = {
              uid: user.uid,
              email: user.email || "",
              role: userData.role as UserRole,
              displayName: user.displayName || userData.displayName,
            };
            console.log("✅ Usuario cargado:", userWithRole);
            setUser(userWithRole);
          } else {
            console.error("❌ Usuario no tiene documento en Firestore");
            // Usuario autenticado pero sin rol -> cerrar sesión
            await signOut(auth);
            setUser(null);
          }
        } catch (error) {
          console.error("❌ Error al cargar datos del usuario:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("👋 Sesión cerrada");
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        loading,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
