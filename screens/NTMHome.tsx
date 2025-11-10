// screens/NTMHome.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, RefreshControl } from "react-native";
import { fetchTransactionsByVoLet, Transaction, deleteTransaction } from "../services/api";
import Header from "../components/Header";
import TopBubbles from "../components/TopBubbles";
import useSolde from "../hooks/useSolde";
import TransactionListImport from "../components/TransactionList";
const TransactionList = TransactionListImport as unknown as React.ComponentType<any>;
import AddTransactionButton from "../components/AddTransactionButton";
import Toast from "../components/Toast";

export default function NTMHome() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  
  // ✅ State pour les filtres
  const [filters, setFilters] = useState<{
    categorie?: string;
  }>({});
  
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
      console.log("Suppression de la transaction ID:", id);
      await deleteTransaction(id);
      await loadTransactions(); // Recharger la liste
      
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

  // ✅ Fonction de filtrage par catégorie
  const handleFilterByCategorie = (categorie: string) => {
    if (filters.categorie === categorie) {
      // Si on clique sur la même catégorie, on retire le filtre
      setFilters({});
      setToast({
        visible: true,
        message: "Filtre retiré",
        type: "success",
      });
    } else {
      setFilters({ categorie });
      setToast({
        visible: true,
        message: `Filtré par: ${categorie}`,
        type: "success",
      });
    }
  };

  // ✅ Fonction pour réinitialiser les filtres
  const clearFilters = () => {
    setFilters({});
    setToast({
      visible: true,
      message: "Filtres réinitialisés",
      type: "success",
    });
  };

  // ✅ Filtrer les transactions
  const filteredTransactions = transactions.filter((tx) => {
    if (filters.categorie && tx.categorie_detail?.nom !== filters.categorie) return false;
    return true;
  });

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
        <TopBubbles totalRevenus={totalRevenus} totalDepenses={totalDepenses} solde={solde} />

        {/* ✅ Affichage des filtres actifs */}
        {filters.categorie && (
          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>
              🔍 Catégorie: {filters.categorie}
            </Text>
            <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕ Effacer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ✅ Liste des transactions avec filtrage */}
        <TransactionList 
          transactions={filteredTransactions} 
          onDelete={handleDelete}
          onFilterByCategorie={handleFilterByCategorie}
          onRefresh={loadTransactions}
        />
      </ScrollView>

      {/* ✅ Bouton flottant pour ajouter une transaction */}
      <AddTransactionButton 
        volet="suivi" 
        onTransactionAdded={loadTransactions}
      />

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
  container: { 
    flex: 1, 
    backgroundColor: "#F8FAFC" 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100, // Espace pour le bouton flottant
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  filterText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
  },
  clearButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});