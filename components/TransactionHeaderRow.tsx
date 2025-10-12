import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TransactionHeaderRow: React.FC = () => (
  <View style={[styles.row, styles.headerRow]}>
    <Text style={[styles.headerCell, styles.cellId]}>ID</Text>
    <Text style={[styles.headerCell, styles.cellLibelle]}>Libellé</Text>
    <Text style={[styles.headerCell, styles.cellCategorie]}>Catégorie</Text>
    <Text style={[styles.headerCell, styles.cellMontant]}>Montant</Text>
    <Text style={[styles.headerCell, styles.cellDate]}>Date</Text>
  </View>
);

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 6, paddingHorizontal: 4 },
  headerRow: { borderBottomWidth: 2, borderColor: "#000", backgroundColor: "#f7f7f7", paddingVertical: 8 },
  headerCell: { fontWeight: "bold", textAlign: "center", color: "#333" },
  cellId: { flex: 0.5 },
  cellLibelle: { flex: 1.2 },
  cellCategorie: { flex: 1 },
  cellMontant: { flex: 1 },
  cellDate: { flex: 1.2 },
});

export default TransactionHeaderRow;
