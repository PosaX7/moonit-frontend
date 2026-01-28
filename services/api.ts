import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔗 URL du backend Django
export const API_URL = "https://moonit-backend-10.onrender.com/api";

// ============================
  // TYPES
// ============================

export interface Categorie {
  id: string;
  nom: string;
  type_categorie: "depense" | "revenu";
  icone: string;
  couleur: string;
  est_predefinite: boolean;
  est_active: boolean;
  ordre: number;
  nb_transactions: number;
  created_at: string;
  updated_at: string;
}

export interface Libelle {
  id?: string;
  nom: string;
  date: string;
  montant: number;
  commentaire?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Photo {
  id?: string;
  image: string;
  image_url?: string;
  legende?: string;
  created_at?: string;
}

export interface Transaction {
  date: string | number | Date;
  local_id: number;
  id: string;
  user: number;
  user_username?: string;
  volet: "suivi" | "budget";
  volet_display?: string;
  position: "depense" | "revenu";
  position_display?: string;
  categorie: string;
  categorie_detail?: {
    id: string;
    nom: string;
    icone: string;
    couleur: string;
    type_categorie: string;
  };
  statut: "en_attente" | "validee" | "annulee";
  statut_display?: string;
  devise: string;
  libelles: Libelle[];
  photos: Photo[];
  montant_total: number;
  nb_libelles: number;
  created_at: string;
  updated_at: string;
}

export interface TransactionCreate {
  position: "depense" | "revenu";
  categorie_id: string;
  volet: "suivi" | "budget";
  libelles: Array<{
    nom: string;
    date: string;
    montant: number;
    commentaire?: string;
  }>;
}

export interface Statistiques {
  total_revenus: number;
  total_depenses: number;
  solde: number;
  nb_transactions: number;
  depenses_par_categorie: Array<{
    categorie__nom: string;
    categorie__couleur: string;
    categorie__icone: string;
    total: number;
    nombre: number;
  }>;
  revenus_par_categorie: Array<{
    categorie__nom: string;
    categorie__couleur: string;
    categorie__icone: string;
    total: number;
    nombre: number;
  }>;
}

// ============================
// AXIOS INSTANCE
// ============================

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ============================
// AUTH
// ============================

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

// ============================
// CATÉGORIES
// ============================

export async function fetchCategories(type?: "depense" | "revenu"): Promise<Categorie[]> {
  const url = type ? `/transactions/categories/?type_categorie=${type}` : "/transactions/categories/";
  const res = await api.get(url);
  return res.data;
}

export async function fetchPredefinedCategories(): Promise<Categorie[]> {
  const res = await api.get("/transactions/categories/predefinies/");
  return res.data;
}

export async function fetchCustomCategories(): Promise<Categorie[]> {
  const res = await api.get("/transactions/categories/personnalisees/");
  return res.data;
}

export async function createCategorie(data: {
  nom: string;
  type_categorie: "depense" | "revenu";
  icone?: string;
  couleur?: string;
  ordre?: number;
}): Promise<Categorie> {
  const res = await api.post("/transactions/categories/", data);
  return res.data;
}

export async function deleteCategorie(id: string): Promise<void> {
  await api.delete(`/transactions/categories/${id}/`);
}

// ============================
// TRANSACTIONS
// ============================

export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await api.get("/transactions/");
  return res.data;
}

export async function fetchTransactionsByVoLet(volet: "suivi" | "budget"): Promise<Transaction[]> {
  const res = await api.get(`/transactions/?volet=${volet}`);
  return res.data;
}

export async function fetchTransactionsByMonth(
  annee: number,
  mois: number,
  volet?: "suivi" | "budget"
): Promise<Transaction[]> {
  let url = `/transactions/par_mois/?annee=${annee}&mois=${mois}`;
  if (volet) url += `&volet=${volet}`;
  const res = await api.get(url);
  return res.data;
}

export async function fetchRecentTransactions(): Promise<Transaction[]> {
  const res = await api.get("/transactions/recentes/");
  return res.data;
}

export async function createTransaction(data: TransactionCreate): Promise<Transaction> {
  const res = await api.post("/transactions/", data);
  return res.data;
}

export async function fetchTransaction(id: string): Promise<Transaction> {
  const res = await api.get(`/transactions/${id}/`);
  return res.data;
}

export async function updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
  const res = await api.put(`/transactions/${id}/`, data);
  return res.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/transactions/${id}/`);
}

// ============================
// PHOTOS
// ============================

export async function addPhotoToTransaction(
  transactionId: string,
  photo: FormData
): Promise<Photo> {
  const res = await api.post(
    `/transactions/transactions/${transactionId}/ajouter_photo/`,
    photo,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
}

// ============================
// STATISTIQUES
// ============================

export async function fetchStatistiques(params?: {
  volet?: "suivi" | "budget";
  date_debut?: string;
  date_fin?: string;
}): Promise<Statistiques> {
  const queryParams = new URLSearchParams();
  if (params?.volet) queryParams.append("volet", params.volet);
  if (params?.date_debut) queryParams.append("date_debut", params.date_debut);
  if (params?.date_fin) queryParams.append("date_fin", params.date_fin);

  const url = `/transactions/statistiques/?${queryParams.toString()}`;
  const res = await api.get(url);
  return res.data;
}

// ============================
// ALIAS (compatibilité)
// ============================

export const getTransactions = fetchTransactions;
export const fetchTransactionsByModule = fetchTransactionsByVoLet;



// ============================
// BUDJET TRANSACTIONS
// ============================

// --- Fetch transactions budget ---
export async function fetchBudgetTransactions(): Promise<Transaction[]> {
  const res = await api.get("/transactions/?volet=budget");
  return res.data;
}