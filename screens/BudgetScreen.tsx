// screens/BudgetScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Modal } from "react-native";
import ButtonBudget from "../components/ButtonBudget";
import TransactionForm, { TransactionFormValues } from "../components/form/TransactionForm";

type Transaction = {
  id: string;
  position: "depense" | "revenu";
  categorieId: string;
  categorie: string;
  libelles: { nom: string; montant: number }[];
  commentaire?: string;
  date: Date;
};

type Categorie = {
  id: string;
  nom: string;
  icone: string;
  couleur: string;
};

export default function BudgetScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([
    { id: "1", nom: "Alimentation", icone: "🍕", couleur: "#EF4444" },
    { id: "2", nom: "Transport", icone: "🚗", couleur: "#3B82F6" },
    { id: "3", nom: "Loisirs", icone: "🎮", couleur: "#8B5CF6" },
    { id: "4", nom: "Santé", icone: "💊", couleur: "#10B981" },
    { id: "5", nom: "Salaire", icone: "💼", couleur: "#22C55E" },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Ouvre le formulaire
  const handleOpenForm = () => {
    setShowForm(true);
  };

  // Ferme le formulaire
  const handleCloseForm = () => {
    setShowForm(false);
  };

  // Ajoute une transaction à la liste
  const handleSubmitTransaction = async (values: TransactionFormValues) => {
    setSubmitting(true);
    
    // Simulation d'une requête réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    const selectedCategory = categories.find(c => c.id === values.categorieId);
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      position: values.position,
      categorieId: values.categorieId,
      categorie: selectedCategory?.nom || "Autre",
      libelles: values.libelles,
      commentaire: values.commentaire,
      date: values.date,
    };

    setTransactions([newTransaction, ...transactions]);
    setSubmitting(false);
    setShowForm(false);
  };

  // Ajoute une nouvelle catégorie
  const handleAddCategory = async (name: string, position: "depense" | "revenu") => {
    setLoadingCategories(true);
    
    // Simulation d'une requête réseau
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCategory: Categorie = {
      id: Date.now().toString(),
      nom: name,
      icone: position === "depense" ? "📦" : "💵",
      couleur: position === "depense" ? "#F59E0B" : "#06B6D4",
    };

    setCategories([...categories, newCategory]);
    setLoadingCategories(false);
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const totalMontant = item.libelles.reduce((sum, l) => sum + l.montant, 0);
    
    return (
      <View style={styles.transactionCard}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionTitle}>
            {item.position === "depense" ? "💸" : "💰"} {item.categorie}
          </Text>
          <Text style={[
            styles.transactionTotal,
            item.position === "depense" ? styles.depenseColor : styles.revenuColor
          ]}>
            {item.position === "depense" ? "-" : "+"}{totalMontant.toLocaleString()} FCFA
          </Text>
        </View>
        
        {item.libelles.map((l, i) => (
          <Text key={i} style={styles.transactionDetail}>
            • {l.nom} — {l.montant.toLocaleString()} FCFA
          </Text>
        ))}
        
        {item.commentaire ? (
          <Text style={styles.transactionComment}>💬 {item.commentaire}</Text>
        ) : null}
        
        <Text style={styles.transactionDate}>
          {item.date.toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Budget</Text>

      {/* Résumé */}
      {transactions.length > 0 && (
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Revenus</Text>
            <Text style={[styles.summaryValue, styles.revenuColor]}>
              +{transactions
                .filter(t => t.position === "revenu")
                .reduce((sum, t) => sum + t.libelles.reduce((s, l) => s + l.montant, 0), 0)
                .toLocaleString()} FCFA
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Dépenses</Text>
            <Text style={[styles.summaryValue, styles.depenseColor]}>
              -{transactions
                .filter(t => t.position === "depense")
                .reduce((sum, t) => sum + t.libelles.reduce((s, l) => s + l.montant, 0), 0)
                .toLocaleString()} FCFA
            </Text>
          </View>
        </View>
      )}

      {/* Liste des transactions */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>Aucune transaction</Text>
            <Text style={styles.emptyText}>
              Appuyez sur le bouton + pour ajouter votre première transaction
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      {/* Bouton + */}
      {!showForm && <ButtonBudget onPress={handleOpenForm} />}

      {/* Formulaire TransactionForm */}
      <Modal
        visible={showForm}
        animationType="slide"
        onRequestClose={handleCloseForm}
      >
        <TransactionForm
          categories={categories}
          loadingCategories={loadingCategories}
          showDate={true}
          submitting={submitting}
          onSubmit={handleSubmitTransaction}
          onAddCategory={handleAddCategory}
          onClose={handleCloseForm}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },
  revenuColor: {
    color: "#22C55E",
  },
  depenseColor: {
    color: "#EF4444",
  },
  transactionCard: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  transactionTotal: {
    fontSize: 16,
    fontWeight: "700",
  },
  transactionDetail: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 4,
    paddingLeft: 8,
  },
  transactionComment: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 8,
    fontStyle: "italic",
    backgroundColor: "#F9FAFB",
    padding: 8,
    borderRadius: 6,
  },
  transactionDate: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "right",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});