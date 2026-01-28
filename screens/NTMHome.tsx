// screens/NTMHome.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, RefreshControl } from "react-native";
import { fetchTransactionsByVoLet, Transaction, deleteTransaction } from "../services/api";
import Header from "../components/Header";
import TopBubbles from "../components/TopBubbles";
import useSolde from "../hooks/useSolde";
import TransactionList from "../components/TransactionList";
import AddTransactionButton from "../components/AddTransactionButton";
import Toast from "../components/Toast";
import SuiviFiltreMini from "../components/SuiviFiltreMini";

export default function NTMHome() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({
    visible: false,
    message: "",
    type: "success",
  });

  // Charger les transactions
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const data = await fetchTransactionsByVoLet("suivi");
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (err) {
      console.error("Erreur chargement:", err);
      setToast({
        visible: true,
        message: "Erreur de chargement",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id);
      await loadTransactions();
      setToast({
        visible: true,
        message: "Transaction supprimée avec succès",
        type: "success",
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setToast({
        visible: true,
        message: "Échec de suppression",
        type: "error",
      });
    }
  };

  const handleFilterChange = (filtered: Transaction[]) => {
    setFilteredTransactions(filtered);
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  // Calcul des totaux sur les transactions filtrées
  const { totalRevenus, totalDepenses, solde } = useSolde(filteredTransactions);

  return (
    <View style={styles.container}>
      <Header title="NoTiMo" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadTransactions}
            tintColor="#14B8A6"
            colors={["#14B8A6"]}
          />
        }
      >
        {/* 🔵 Bulle des soldes */}
        <TopBubbles totalRevenus={totalRevenus} totalDepenses={totalDepenses} solde={solde} />

        {/* 📄 Liste des transactions */}
        <TransactionList
          transactions={transactions}
          onDelete={handleDelete}
          onFilterChange={handleFilterChange}
        />
      </ScrollView>

      {/* ➕ Ajouter transaction */}
      <AddTransactionButton volet="suivi" onTransactionAdded={loadTransactions} />

      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollView: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
});