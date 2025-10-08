// components/TransactionList.tsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Transaction } from "../services/api";

// Fonction utilitaire pour formater la date
const formatDateFR = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleString("fr-FR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

interface Props {
  transactions: Transaction[];
}

const TransactionList: React.FC<Props> = ({ transactions }) => {
  // 🔹 On trie les transactions par date décroissante
  // 🔹 La transaction initiale (local_id = 0) reste en bas
  const sortedTransactions = [...transactions].sort((a, b) => {
    if (a.local_id === 0) return 1; // NoTiMo à la fin
    if (b.local_id === 0) return -1;
    return new Date(b.date).getTime() - new Date(a.date).getTime(); // plus récente en haut
  });

  return (
    <View>
      {/* Header du tableau */}
      <View style={styles.tableHeader}>
        <Text style={styles.col}>ID</Text>
        <Text style={styles.col}>Libellé</Text>
        <Text style={styles.col}>Catégorie</Text>
        <Text style={styles.col}>Montant</Text>
        <Text style={styles.col}>Date</Text>
      </View>

      {/* Liste des transactions */}
      <FlatList
        data={sortedTransactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.tableRow,
              item.local_id === 0
                ? styles.rowInitial
                : item.type === "depense"
                ? styles.rowDepense
                : styles.rowRevenu,
            ]}
          >
            <Text style={styles.col}>{item.local_id}</Text>
            <Text style={styles.col}>{item.libelle}</Text>
            <Text style={styles.col}>{item.categorie}</Text>
            <Text style={styles.col}>{item.montant.toLocaleString()}</Text>
            <Text style={styles.col}>{formatDateFR(item.date)}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  rowRevenu: { backgroundColor: "#e5ffe5" },  // vert clair
  rowInitial: { backgroundColor: "#f0f0f0" }, // gris clair pour NoTiMo
});

export default TransactionList;
