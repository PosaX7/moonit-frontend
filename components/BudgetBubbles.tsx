import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BudgetBubblesProps {
  totalRevenus: number;
  totalDepenses: number;
  solde: number;
}

export default function BudgetBubbles({ totalRevenus, totalDepenses, solde }: BudgetBubblesProps) {
  const formatMontant = (montant: number) =>
    montant.toLocaleString("fr-FR", { minimumFractionDigits: 0 });

  return (
    <View style={styles.container}>
      {/* Solde Planifié */}
      <View style={[styles.bubble, styles.soldeBubble]}>
        <Text style={styles.label}>Solde Planifié</Text>
        <Text style={[styles.amount, solde < 0 ? styles.amountNegative : styles.amountPositive]}>
          {formatMontant(solde)}
        </Text>
      </View>

      {/* Revenus Prévus */}
      <View style={[styles.bubble, styles.revenusBubble]}>
        <Text style={styles.label}>Revenus Prévus</Text>
        <Text style={styles.amount}>{formatMontant(totalRevenus)}</Text>
      </View>

      {/* Dépenses Prévues */}
      <View style={[styles.bubble, styles.depensesBubble]}>
        <Text style={styles.label}>Dépenses Prévues</Text>
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
  bubble: {
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
  amountPositive: {
    color: "#10b981",
  },
  amountNegative: {
    color: "#ef4444",
  },
  soldeBubble: {
    backgroundColor: "#0c0c10ff",
    borderColor: "#0c0c10ff",
    shadowColor: "#0c0c10ff",
  },
  revenusBubble: {
    backgroundColor: "#059669",
    borderColor: "#10b981",
    shadowColor: "#059669",
  },
  depensesBubble: {
    backgroundColor: "#dc2626",
    borderColor: "#ef4444",
    shadowColor: "#dc2626",
  },
});