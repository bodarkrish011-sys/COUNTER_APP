// Context = a shared box of data any component can read.
// This one stores who is logged in, plus login / register / logout functions.
import { createContext, useContext, useState } from "react";
import api from "../api";

const AuthContext = createContext(null);

// Read the saved login from the browser (so refreshing the page keeps you logged in).
const loadSavedAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("auth"));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadSavedAuth); // { token, user } or null

  const saveAuth = (data) => {
    localStorage.setItem("auth", JSON.stringify(data));
    setAuth(data);
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    saveAuth(data);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    saveAuth(data);
  };

  const logout = () => {
    localStorage.removeItem("auth");
    setAuth(null);
  };

  const value = { user: auth?.user, token: auth?.token, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// A shortcut so components can write: const { user, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);
