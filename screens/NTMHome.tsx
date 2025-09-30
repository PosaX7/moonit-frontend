// screens/NTMHome.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { fetchTransactions, Transaction } from "../services/api";
import AddTransaction from "../components/AddTransaction";
import Header from "../components/Header";
import TopBubbles from "../components/TopBubbles";
import useSolde from "../hooks/useSolde";
import TransactionList from "../components/TransactionList"; // <-- nouveau composant

export default function NTMHome() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState<"revenu" | "depense" | null>(null);

  useEffect(() => {
    fetchTransactions()
      .then(setTransactions)
      .catch((err) => console.error("Erreur chargement:", err));
  }, []);

  const handleAdded = (newTx: Transaction) => {
    setTransactions((prev) => [...prev, newTx]);
  };

  const { totalRevenus, totalDepenses, solde } = useSolde(transactions);

  return (
    <View style={styles.container}>
      <Header title="NoTiMo" />
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

      {/* Formulaire d'ajout */}
      {showForm && <AddTransaction type={showForm} onAdded={handleAdded} onClose={() => setShowForm(null)} />}

      {/* Tableau des transactions */}
      <TransactionList transactions={transactions} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
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
});
