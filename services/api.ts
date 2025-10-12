import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔗 URL de ton backend déployé
export const API_URL = "https://moonit-backend-10.onrender.com/api";

// ---- Types ----
export interface Transaction {
  id: number;
  local_id: number;
  libelle: string;
  montant: number;
  categorie: string;
  type: "revenu" | "depense";
  date: string;
  module?: string;
}

// ---- Axios Instance ----
export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ---- Auth ----
export async function registerUser(username: string, email: string, password: string) {
  const res = await axios.post(`${API_URL}/auth/register/`, { username, email, password });
  return res.data;
}

export async function loginUser(username: string, password: string) {
  const res = await axios.post(`${API_URL}/auth/login/`, { username, password });
  const { access, refresh } = res.data;
  if (access) await AsyncStorage.setItem("token", access);
  if (refresh) await AsyncStorage.setItem("refreshToken", refresh);
  return res.data;
}

export async function refreshAccessToken() {
  const refresh = await AsyncStorage.getItem("refreshToken");
  if (!refresh) return null;
  try {
    const res = await axios.post(`${API_URL}/auth/token/refresh/`, { refresh });
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

// ---- Transactions ----

// Récupérer toutes les transactions
export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await api.get("/transactions/");
  return res.data;
}

// Créer une transaction
export async function createTransaction(transaction: Omit<Transaction, "id" | "date">): Promise<Transaction> {
  const res = await api.post("/transactions/", transaction);
  return res.data;
}

// Supprimer une transaction
export async function deleteTransaction(id: number): Promise<void> {
  await api.delete(`/transactions/${id}/`);
}

// Modifier une transaction
export async function updateTransaction(transaction: Transaction): Promise<Transaction> {
  const res = await api.put(`/transactions/${transaction.id}/`, transaction);
  return res.data;
}


// ---- Alias pour compatibilité ----
export async function getTransactions(): Promise<Transaction[]> {
  return fetchTransactions();
}

// services/api.ts

// Ajoute ces deux fonctions à ton fichier api.ts

// Récupérer les transactions par libellé
export async function fetchTransactionsByLibelle(libelle: string): Promise<Transaction[]> {
  const response = await api.get(`/transactions/by-libelle/${encodeURIComponent(libelle)}/`);
  return response.data;
}

// Récupérer les transactions par catégorie
export async function fetchTransactionsByCategorie(categorie: string): Promise<Transaction[]> {
  const response = await api.get(`/transactions/by-categorie/${encodeURIComponent(categorie)}/`);
  return response.data;
}

// Récupérer la liste unique des libellés
export async function fetchLibelles(): Promise<string[]> {
  const response = await api.get('/transactions/libelles/');
  return response.data;
}

// Récupérer la liste unique des catégories
export async function fetchCategories(): Promise<string[]> {
  const response = await api.get('/transactions/categories/');
  return response.data;
}