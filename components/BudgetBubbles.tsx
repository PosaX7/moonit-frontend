// components/BudgetBubbles.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface BudgetBubblesProps {
  totalRevenus: number;
  totalDepenses: number;
  solde: number;
}

export default function BudgetBubbles({ totalRevenus, totalDepenses, solde }: BudgetBubblesProps) {
  const formatMontant = (montant: number) => {
    return `${Math.abs(montant).toLocaleString("fr-FR")} FCFA`;
  };

  return (
    <View style={styles.container}>
      {/* Solde */}
      <View style={[styles.bubble, styles.soldeBubble]}>
        <Text style={styles.label}>Solde Planifié</Text>
        <Text style={[styles.amount, solde < 0 && styles.negativeAmount]}>
          {solde >= 0 ? "+" : "-"} {formatMontant(solde)}
        </Text>
      </View>

      {/* Revenus */}
      <View style={[styles.bubble, styles.revenusBubble]}>
        <Text style={styles.label}>Revenus Prévus</Text>
        <Text style={styles.amount}>+ {formatMontant(totalRevenus)}</Text>
      </View>

      {/* Dépenses */}
      <View style={[styles.bubble, styles.depensesBubble]}>
        <Text style={styles.label}>Dépenses Prévues</Text>
        <Text style={styles.amount}>- {formatMontant(totalDepenses)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    gap: 10,
  },
  bubble: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  soldeBubble: {
    backgroundColor: "#3b82f6",
  },
  revenusBubble: {
    backgroundColor: "#10b981",
  },
  depensesBubble: {
    backgroundColor: "#ef4444",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ffffff",
    opacity: 0.9,
    marginBottom: 6,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  amount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.3,
  },
  negativeAmount: {
    color: "#fee",
  },
});