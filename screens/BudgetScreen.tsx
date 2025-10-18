// screens/BudgetScreen.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from "react-native";
import { fetchTransactionsByModule, Transaction, deleteTransaction } from "../services/api";
import Title_Budget from "../components/TitleBudget";
import BudgetBubbles from "../components/BudgetBubbles";
import AddBudgetTransaction from "../components/AddBudgetTransaction";
import BudgetTransactionList from "../components/BudgetTransactionList";
import Toast from "../components/Toast";

export default function BudgetScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState<"revenu" | "depense" | null>(null);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
  }>({
    visible: false,
    message: "",
    type: "success",
  });

  // Charger les transactions du module "budget"
  useEffect(() => {
    fetchTransactionsByModule("budget")
      .then(setTransactions)
      .catch((err) => console.error("Erreur chargement budget:", err));
  }, []);

  // Calculer les totaux
  const totalRevenus = transactions
    .filter((tx) => tx.type === "revenu")
    .reduce((sum, tx) => sum + tx.montant, 0);

  const totalDepenses = transactions
    .filter((tx) => tx.type === "depense")
    .reduce((sum, tx) => sum + tx.montant, 0);

  const solde = totalRevenus - totalDepenses;

  // Ajouter une ou plusieurs transactions
  const handleAdded = (newTxs: Transaction[]) => {
    setTransactions((prev) => [...prev, ...newTxs]);
    setToast({
      visible: true,
      message: "Transaction planifiée ajoutée !",
      type: "success",
    });
  };

  // Supprimer une transaction
  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      setTransactions((prev) => prev.filter((tx) => tx.id !== id));
      setToast({
        visible: true,
        message: "Transaction supprimée",
        type: "success",
      });
    } catch (error) {
      console.error("Erreur suppression:", error);
      setToast({
        visible: true,
        message: "Échec de suppression",
        type: "error",
      });
    }
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, visible: false }));
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        {/* Titre */}
        <Title_Budget />

        {/* Bulles récapitulatives */}
        <BudgetBubbles
          totalRevenus={totalRevenus}
          totalDepenses={totalDepenses}
          solde={solde}
        />

        {/* Boutons Dépense / Revenu */}
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={[styles.btn, showForm === "depense" && styles.btnActiveDepense]}
            onPress={() => setShowForm(showForm === "depense" ? null : "depense")}
          >
            <Text style={styles.btnText}>Planifier une sortie d'argent (Dépense)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btn, showForm === "revenu" && styles.btnActiveRevenu]}
            onPress={() => setShowForm(showForm === "revenu" ? null : "revenu")}
          >
            <Text style={styles.btnText}>Planifier une entrée d'argent (Revenu)</Text>
          </TouchableOpacity>
        </View>

        {/* Formulaire d'ajout */}
        {showForm && (
          <AddBudgetTransaction
            type={showForm}
            onAdded={handleAdded}
            onClose={() => setShowForm(null)}
          />
        )}

        {/* Liste des transactions */}
        <BudgetTransactionList transactions={transactions} onDelete={handleDelete} />
      </ScrollView>

      {/* Toast */}
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
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 100, // Pour éviter que le contenu soit caché par le Bottom Tab
  },
  headerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 15,
    gap: 10,
  },
  btn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  btnActiveDepense: {
    backgroundColor: "#ef4444",
  },
  btnActiveRevenu: {
    backgroundColor: "#10b981",
  },
});