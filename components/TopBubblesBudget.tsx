// components/TopBubblesBudget.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  totalRevenus: number;
  totalDepenses: number;
  solde: number;
};

export default function TopBubblesBudget({ totalRevenus, totalDepenses, solde }: Props) {
  const formatMontant = (montant: number) => Number(montant).toFixed(0);

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.solde]}>
        <Text style={styles.label}>Solde</Text>
        <Text style={styles.amount}>{formatMontant(solde)}</Text>
      </View>
      <View style={[styles.row, styles.revenus]}>
        <Text style={styles.label}>Revenus</Text>
        <Text style={styles.amount}>{formatMontant(totalRevenus)}</Text>
      </View>
      <View style={[styles.row, styles.depenses]}>
        <Text style={styles.label}>Dépenses</Text>
        <Text style={styles.amount}>{formatMontant(totalDepenses)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 10,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    borderWidth: 1,
  },
  label: {
    color: "rgba(255, 255, 255, 0.9)",
    fontWeight: "600",
    fontSize: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  amount: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  solde: {
    backgroundColor: "#0c0c10ff",
    borderColor: "#0c0c10ff",
    shadowColor: "#0c0c10ff",
  },
  revenus: {
    backgroundColor: "#059669",
    borderColor: "#10b981",
    shadowColor: "#059669",
  },
  depenses: {
    backgroundColor: "#dc2626",
    borderColor: "#ef4444",
    shadowColor: "#dc2626",
  },
});
