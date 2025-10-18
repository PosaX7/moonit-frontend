// components/BudgetTransactionList.tsx
import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Transaction } from "../services/api";
import { Trash2 } from "lucide-react-native";

interface BudgetTransactionListProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
}

export default function BudgetTransactionList({
  transactions,
  onDelete,
}: BudgetTransactionListProps) {
  const formatMontant = (montant: number) => {
    return `${Math.abs(montant).toLocaleString("fr-FR")} FCFA`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderItem = ({ item }: { item: Transaction }) => (
    <View
      style={[
        styles.transactionCard,
        item.type === "depense" ? styles.depenseCard : styles.revenuCard,
      ]}
    >
      <View style={styles.transactionContent}>
        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.libelle}>{item.libelle}</Text>
            <Text style={styles.categorie}>{item.categorie}</Text>
          </View>
          <TouchableOpacity
            onPress={() => onDelete(item.id || 0)}
            style={styles.deleteButton}
          >
            <Trash2 color="#ef4444" size={20} />
          </TouchableOpacity>
        </View>

        {/* Bas de carte */}
        <View style={styles.footer}>
          <Text style={styles.date}>{formatDate(item.date)}</Text>
          <Text
            style={[
              styles.montant,
              item.type === "depense" ? styles.depenseMontant : styles.revenuMontant,
            ]}
          >
            {formatMontant(item.montant)}
          </Text>
        </View>
      </View>
    </View>
  );

  if (transactions.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>📋 Aucune transaction planifiée</Text>
        <Text style={styles.emptySubtext}>
          Commence à planifier tes revenus et dépenses !
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={transactions}
      renderItem={renderItem}
      keyExtractor={(item, index) => {
        const key = item.id !== undefined && item.id !== null ? item.id.toString() : `budget_${item.local_id}_${index}`;
        return key;
      }}
      contentContainerStyle={styles.listContainer}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 20,
  },
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  depenseCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  revenuCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  transactionContent: {
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: {
    flex: 1,
  },
  libelle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  categorie: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6b7280",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  deleteButton: {
    padding: 6,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 12,
    color: "#9ca3af",
    fontWeight: "500",
  },
  montant: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  depenseMontant: {
    color: "#ef4444",
  },
  revenuMontant: {
    color: "#10b981",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6b7280",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9ca3af",
    textAlign: "center",
  },
});