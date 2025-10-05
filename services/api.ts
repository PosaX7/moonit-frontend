import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔗 URL de ton backend déployé
export const API_URL = "https://moonit-backend-10.onrender.com/api/auth";

// ---- Types ----
export interface Transaction {
  id: number;
  libelle: string;
  montant: number;
  categorie: string;
  type: "revenu" | "depense";
  date: string;
}

// ---- Axios Instance ----
export const api = axios.create({
  baseURL: API_URL,
});

// Ajouter automatiquement le token à chaque requête
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---- Auth ----
export async function registerUser(username: string, email: string, password: string) {
  const res = await axios.post(`${API_URL}/register/`, {
    username,
    email,
    password,
  });
  // pas de token direct après l’inscription → il faut se connecter après
  return res.data;
}

export async function loginUser(username: string, password: string) {
  const res = await axios.post(`${API_URL}/login/`, {
    username,
    password,
  });
  const token = res.data.access;
  const refresh = res.data.refresh;

  if (token) {
    await AsyncStorage.setItem("token", token);
  }
  if (refresh) {
    await AsyncStorage.setItem("refreshToken", refresh);
  }

  return res.data;
}

export async function refreshAccessToken() {
  const refresh = await AsyncStorage.getItem("refreshToken");
  if (!refresh) return null;

  try {
    const res = await axios.post(`${API_URL}/token/refresh/`, { refresh });
    const newToken = res.data.access;
    await AsyncStorage.setItem("token", newToken);
    return newToken;
  } catch (error) {
    console.error("Erreur lors du refresh token", error);
    await logoutUser();
    return null;
  }
}

export async function logoutUser() {
  await AsyncStorage.removeItem("token");
  await AsyncStorage.removeItem("refreshToken");
}

// ---- Exemple de route protégée ----
export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await api.get("https://moonit-backend-10.onrender.com/api/transactions/");
  return res.data;
}

// ---- Transactions ----
export async function createTransaction(transaction: Omit<Transaction, "id" | "date">): Promise<Transaction> {
  const res = await api.post("https://moonit-backend-10.onrender.com/api/transactions/", transaction);
  return res.data;
}
