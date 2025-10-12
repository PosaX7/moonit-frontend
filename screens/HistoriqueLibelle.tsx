import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { fetchTransactionsByLibelle, Transaction } from "../services/api";

type HistoriqueLibelleRouteProp = RouteProp<
  { HistoriqueLibelle: { libelle: string } },
  "HistoriqueLibelle"
>;

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

export default function HistoriqueLibelle() {
  const route = useRoute<HistoriqueLibelleRouteProp>();
  const { libelle } = route.params;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchTransactionsByLibelle(libelle);
        setTransactions(data);
      } catch (error) {
        console.error("Erreur chargement historique libellé:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [libelle]);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#2563eb" />;

  return (
    <View style={{ padding: 10 }}>
      <Text style={styles.title}>Historique du libellé : {libelle}</Text>

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
}

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
    color: "#2563eb",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderColor: "#000",
    paddingBottom: 5,
    marginBottom: 5,
  },
  tableRow: {
  flexDirection: "row",
  borderBottomWidth: 1,
  borderColor: "#eee",
  paddingVertical: 10,
  marginVertical: 2,
},

  col: { flex: 1, textAlign: "center" },
  rowDepense: { backgroundColor: "#ffe5e5" },
  rowRevenu: { backgroundColor: "#e5ffe5" },
  rowInitial: { backgroundColor: "#f0f0f0" },
});
