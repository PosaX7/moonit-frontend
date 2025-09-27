import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { fetchTransactions, Transaction } from "../services/api";
import AddTransaction from "../components/AddTransaction";
import Header from "../components/Header";
import TopBubbles from "../components/TopBubbles";
import useSolde from "../hooks/useSolde";

export default function NTMHome() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState<"revenu" | "depense" | null>(null);

  // Charger les transactions
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
      <TopBubbles 
        totalRevenus={totalRevenus} 
        totalDepenses={totalDepenses} 
        solde={solde} />
      {/* Boutons Dépenses / Revenus */}
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={[
            styles.btn,
            showForm === "depense" && styles.btnActiveDepense,
          ]}
          onPress={() => setShowForm(showForm === "depense" ? null : "depense")}
        >
          <Text style={styles.btnText}>Ajouter une sortie d'argent (Dépense) </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.btn,
            showForm === "revenu" && styles.btnActiveRevenu,
          ]}
          onPress={() => setShowForm(showForm === "revenu" ? null : "revenu")}
        >
          <Text style={styles.btnText}>Ajouter une entrée d'argent (Revenu) </Text>
        </TouchableOpacity>
      </View>

      {/* Formulaire d'ajout */}
      {showForm && (
        <AddTransaction
          type={showForm}
          onAdded={handleAdded}
          onClose={() => setShowForm(null)}
        />
      )}

      {/* Tableau des transactions */}
      <View style={styles.tableHeader}>
        <Text style={styles.col}>ID</Text>
        <Text style={styles.col}>Libellé</Text>
        <Text style={styles.col}>Catégorie</Text>
        <Text style={styles.col}>Montant</Text>
        <Text style={styles.col}>Date</Text>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.tableRow,
              item.type === "depense"
                ? styles.rowDepense
                : styles.rowRevenu,
            ]}
          >
            <Text style={styles.col}>{item.id}</Text>
            <Text style={styles.col}>{item.libelle}</Text>
            <Text style={styles.col}>{item.categorie}</Text>
            <Text style={styles.col}>{item.montant}</Text>
            <Text style={styles.col}>{item.date}</Text>
          </View>
        )}
      />
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

  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#000",
    paddingBottom: 5,
    marginBottom: 5,
    marginTop: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 6,
  },
  col: { flex: 1, textAlign: "center" },

  rowDepense: { backgroundColor: "#ffe5e5" }, // rouge clair
  rowRevenu: { backgroundColor: "#e5ffe5" }, // vert clair
});
