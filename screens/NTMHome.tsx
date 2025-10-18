// screens/NTMHome.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import { fetchTransactions, Transaction, deleteTransaction, fetchTransactionsByModule } from "../services/api";
import AddTransaction from "../components/AddTransaction";
import Header from "../components/Header";
import TopBubbles from "../components/TopBubbles";
import useSolde from "../hooks/useSolde";
import TransactionList from "../components/TransactionList";
import Toast from "../components/Toast";

export default function NTMHome() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState<"revenu" | "depense" | null>(null);
  
  // ✅ State pour les filtres
  const [filters, setFilters] = useState<{
    libelle?: string;
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

  useEffect(() => {
    fetchTransactionsByModule("suivi")
      .then(setTransactions)
      .catch((err) => console.error("Erreur chargement:", err));
  }, []);

  const handleAdded = (newTxs: Transaction[]) => {
    setTransactions((prev) => [...prev, ...newTxs]);
  };

  const handleDelete = async (id: number) => {
    try {
      console.log("Suppression de la transaction ID:", id);
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      
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

  // ✅ Fonction de filtrage par libellé
  const handleFilterByLibelle = (libelle: string) => {
    setFilters({ libelle });
    setToast({
      visible: true,
      message: `Filtré par libellé: ${libelle}`,
      type: "success",
    });
  };

  // ✅ Fonction de filtrage par catégorie
  const handleFilterByCategorie = (categorie: string) => {
    setFilters({ categorie });
    setToast({
      visible: true,
      message: `Filtré par catégorie: ${categorie}`,
      type: "success",
    });
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
    if (filters.libelle && tx.libelle !== filters.libelle) return false;
    if (filters.categorie && tx.categorie !== filters.categorie) return false;
    return true;
  });

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  const { totalRevenus, totalDepenses, solde } = useSolde(filteredTransactions);

  return (
    <View style={styles.container}>
      <Header title="NoTiMo" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <TopBubbles totalRevenus={totalRevenus} totalDepenses={totalDepenses} solde={solde} />

        {/* Boutons Dépenses / Revenus */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.btn, showForm === "depense" && styles.btnActiveDepense]}
            onPress={() => setShowForm(showForm === "depense" ? null : "depense")}
          >
            <Text style={styles.btnText}>Ajouter une sortie d'argent (Dépense)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, showForm === "revenu" && styles.btnActiveRevenu]}
            onPress={() => setShowForm(showForm === "revenu" ? null : "revenu")}
          >
            <Text style={styles.btnText}>Ajouter une entrée d'argent (Revenu)</Text>
          </TouchableOpacity>
        </View>

        {showForm && <AddTransaction type={showForm} onAdded={handleAdded} onClose={() => setShowForm(null)} />}

        {/* ✅ Affichage des filtres actifs */}
        {(filters.libelle || filters.categorie) && (
          <View style={styles.filterContainer}>
            <Text style={styles.filterText}>
              🔍 Filtre actif: {filters.libelle && `Libellé: ${filters.libelle}`}
              {filters.categorie && `Catégorie: ${filters.categorie}`}
            </Text>
            <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕ Effacer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ✅ Passe les fonctions de filtrage */}
        <TransactionList 
          transactions={filteredTransactions} 
          onDelete={handleDelete}
          onFilterByLibelle={handleFilterByLibelle}
          onFilterByCategorie={handleFilterByCategorie}
        />
      </ScrollView>

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
    backgroundColor: "#fff" 
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 30,
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 15,
  },
  btn: {
    flex: 1,
    padding: 12,
    marginHorizontal: 5,
    backgroundColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { fontSize: 16, fontWeight: "bold", color: "#000" },
  btnActiveDepense: { backgroundColor: "#f88" },
  btnActiveRevenu: { backgroundColor: "#8f8" },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#eff6ff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
  },
  filterText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#1e40af",
  },
  clearButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  clearButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
});