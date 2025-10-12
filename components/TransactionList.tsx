// components/TransactionList.tsx
import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Transaction } from "../services/api";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const formatDateFR = (isoDate: string) => {
  const date = new Date(isoDate);
  const dateStr = date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = date.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${dateStr} ${timeStr}`;
};

interface Props {
  transactions: Transaction[];
  onDelete: (id: number) => void;
  onFilterByLibelle?: (libelle: string) => void;
  onFilterByCategorie?: (categorie: string) => void;
}

const TransactionList: React.FC<Props> = ({ 
  transactions, 
  onDelete,
  onFilterByLibelle,
  onFilterByCategorie,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<{
    id: number;
    local_id: number;
  } | null>(null);

  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a.local_id === 0) return 1;
    if (b.local_id === 0) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const handleIdPress = (id: number, local_id: number) => {
    if (local_id === 0) return;
    setSelectedTransaction({ id, local_id });
    setModalVisible(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTransaction) {
      onDelete(selectedTransaction.id);
      setModalVisible(false);
      setSelectedTransaction(null);
    }
  };

  const handleCancelDelete = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  return (
    <View style={styles.container}>
      {/* Titre de section */}
      <Text style={styles.sectionTitle}>Historique des Transactions</Text>

      {/* Header du tableau */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerText, styles.colId]}>ID</Text>
        <Text style={[styles.headerText, styles.colLibelle]}>Libellé</Text>
        <Text style={[styles.headerText, styles.colCategorie]}>Catégorie</Text>
        <Text style={[styles.headerText, styles.colMontant]}>Montant</Text>
        <Text style={[styles.headerText, styles.colDate]}>Date</Text>
      </View>

      {/* Liste des transactions */}
      <FlatList
        data={sortedTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.tableRow,
              item.local_id === 0 && styles.rowInitial,
            ]}
          >
            {/* ID cliquable pour suppression */}
            <TouchableOpacity
              style={styles.colId}
              onPress={() => handleIdPress(item.id, item.local_id)}
              disabled={item.local_id === 0}
            >
              <View style={[
                styles.idBadge,
                item.type === "depense" ? styles.idBadgeDepense : styles.idBadgeRevenu,
                item.local_id === 0 && styles.idBadgeInitial,
              ]}>
                <Text style={styles.idText}>{item.local_id}</Text>
              </View>
            </TouchableOpacity>

            {/* Libellé cliquable pour filtrage */}
            <TouchableOpacity
              style={styles.colLibelle}
              onPress={() => onFilterByLibelle?.(item.libelle)}
              disabled={!onFilterByLibelle || item.local_id === 0}
            >
              <Text
                style={[
                  styles.cellText,
                  onFilterByLibelle && item.local_id !== 0 && styles.clickableText,
                ]}
              >
                {item.libelle}
              </Text>
            </TouchableOpacity>

            {/* Catégorie cliquable pour filtrage */}
            <TouchableOpacity
              style={styles.colCategorie}
              onPress={() => onFilterByCategorie?.(item.categorie)}
              disabled={!onFilterByCategorie || item.local_id === 0}
            >
              <Text
                style={[
                  styles.cellText,
                  onFilterByCategorie && item.local_id !== 0 && styles.clickableText,
                ]}
              >
                {item.categorie}
              </Text>
            </TouchableOpacity>

            {/* Montant centré */}
            <View style={styles.colMontant}>
              <Text style={[
                styles.montantText,
                item.type === "depense" ? styles.montantDepense : styles.montantRevenu,
              ]}>
                {item.montant.toLocaleString()}
              </Text>
            </View>

            {/* Date avec heure centrée */}
            <View style={styles.colDate}>
              <Text style={styles.dateText}>{formatDateFR(item.date)}</Text>
            </View>
          </View>
        )}
      />

      <ConfirmDeleteModal
        visible={modalVisible}
        transactionId={selectedTransaction?.local_id || 0}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f8fafc",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  headerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 6,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  rowInitial: {
    backgroundColor: "#f8fafc",
    opacity: 0.7,
  },
  colId: {
    flex: 0.6,
    alignItems: "center",
    justifyContent: "center",
  },
  colLibelle: {
    flex: 1.5,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  colCategorie: {
    flex: 1.2,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  colMontant: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  colDate: {
    flex: 1.3,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  idBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  idBadgeDepense: {
    backgroundColor: "#fee2e2",
  },
  idBadgeRevenu: {
    backgroundColor: "#d1fae5",
  },
  idBadgeInitial: {
    backgroundColor: "#e2e8f0",
  },
  idText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
  },
  cellText: {
    fontSize: 14,
    color: "#334155",
    fontWeight: "500",
    textAlign: "center",
  },
  clickableText: {
    color: "#2563eb",
    textDecorationLine: "underline",
  },
  montantText: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  montantDepense: {
    color: "#dc2626",
  },
  montantRevenu: {
    color: "#059669",
  },
  dateText: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
    textAlign: "center",
  },
});

export default TransactionList;