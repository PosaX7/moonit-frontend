// screens/BudgetScreen.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, ActivityIndicator, ScrollView, RefreshControl } from "react-native";
import ButtonBudget from "../components/ButtonBudget";
import AddBudgetTransaction from "../components/AddBudgetTransact";
import Header from "../components/Header";
import TransactionListBudget from "../components/TransactionListBudget";
import CategorieTransactionBudget from "../components/CategorieTransactionBudget";
import TopBubblesBudget from "../components/TopBubblesBudget";
import { fetchTransactionsByVoLet, fetchTransaction, deleteTransaction } from "../services/api";
import type { Transaction } from "../services/api";
import useSolde from "../hooks/useSolde";

export default function BudgetScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const { totalRevenus, totalDepenses, solde } = useSolde(filteredTransactions);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const data = await fetchTransactionsByVoLet("budget");
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les transactions");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleTransactionAdded = () => {
    setShowForm(false);
    loadTransactions();
  };

  const handleCategoryPress = async (transaction: Transaction) => {
    try {
      setLoadingDetail(true);
      const detail = await fetchTransaction(transaction.id);
      setSelectedTransaction(detail);
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les détails");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleBack = () => setSelectedTransaction(null);

  const handleFilterChange = (filtered: Transaction[]) => {
    setFilteredTransactions(filtered);
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    Alert.alert(
      "Confirmer la suppression",
      "Voulez-vous vraiment supprimer cette transaction ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransaction(transactionId);
              setTransactions(transactions.filter(t => t.id !== transactionId));
              setFilteredTransactions(filteredTransactions.filter(t => t.id !== transactionId));
              Alert.alert("Succès", "Transaction supprimée");
            } catch (error) {
              Alert.alert("Erreur", "Impossible de supprimer la transaction");
            }
          },
        },
      ]
    );
  };

  if (selectedTransaction) {
    return (
      <CategorieTransactionBudget
        transaction={selectedTransaction}
        onBack={handleBack}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Budget" />

      {loadingDetail && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={loadTransactions}
            tintColor="#F97316"
            colors={["#F97316"]}
          />
        }
      >
        <TopBubblesBudget
          totalRevenus={totalRevenus}
          totalDepenses={totalDepenses}
          solde={solde}
        />

        <TransactionListBudget
          transactions={transactions}
          onDelete={handleDeleteTransaction}
          onCategoryPress={handleCategoryPress}
          onFilterChange={handleFilterChange}
        />
      </ScrollView>

      {!showForm && <ButtonBudget onPress={handleOpenForm} />}

      {showForm && (
        <AddBudgetTransaction
          volet="budget"
          onClose={handleCloseForm}
          onTransactionAdded={handleTransactionAdded}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
});
