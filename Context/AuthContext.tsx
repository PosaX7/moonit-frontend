// Moonit_frontend/Context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
// Update the import to match the actual export from authService
import { logoutUser as logout } from "../services/authService";
// If getUserFromStorage is a default export or has a different name, import it accordingly:
// import getUserFromStorage from "../services/authService";
// or
// import { fetchUserFromStorage, logoutUser as logout } from "../services/authService";

type AuthContextType = {
  user: any;
  setUser: (user: any) => void;
  logoutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await getUserFromStorage();
      if (stored) setUser(stored.user);
    };
    loadUser();
  }, []);

  const logoutUser = async () => {
    await logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
