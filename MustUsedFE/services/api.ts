import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/transactions/";
const SOLDE_API = "http://127.0.0.1:8000/api/solde/";

// ---- Types ----
export interface Transaction {
  id: number;
  libelle: string;
  montant: number;
  categorie: string;
  type: "revenu" | "depense";
  date: string;
}

// ---- Transactions ----

// Récupérer toutes les transactions
export async function fetchTransactions(): Promise<Transaction[]> {
  const res = await axios.get(API_URL);
  return res.data;
}

// Créer une transaction
export async function createTransaction(
  tx: Omit<Transaction, "id" | "date">
) {
  const res = await axios.post(API_URL, tx);
  return res.data;
}

// Supprimer une transaction
export async function deleteTransaction(id: number) {
  const res = await axios.delete(`${API_URL}${id}/`);
  return res.data;
}

// ---- Solde ----

// Récupérer le solde (revenus - dépenses)
export async function fetchSolde(): Promise<{ solde: number }> {
  const res = await axios.get(SOLDE_API);
  return res.data;
}
