// components/TopBubbles.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  totalRevenus: number;
  totalDepenses: number;
  solde: number;
};

export default function TopBubbles({ totalRevenus, totalDepenses, solde }: Props) {
  const formatMontant = (montant: number) =>
    montant.toLocaleString("fr-FR", { minimumFractionDigits: 0 });

  return (
    <View style={styles.container}>
      {/* Solde */}
      <View style={[styles.bubble, styles.solde]}>
        <Text style={styles.label}>Solde</Text>
        <Text style={styles.amount}>{formatMontant(solde)}</Text>
      </View>

      {/* Dépenses */}
      <View style={[styles.bubble, styles.depenses]}>
        <Text style={styles.label}>Dépenses</Text>
        <Text style={styles.amount}>{formatMontant(totalDepenses)}</Text>
      </View>

      {/* Revenus */}
      <View style={[styles.bubble, styles.revenus]}>
        <Text style={styles.label}>Revenus</Text>
        <Text style={styles.amount}>{formatMontant(totalRevenus)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    paddingHorizontal: 10,
    gap: 12,
  },
  bubble: {
    flex: 1,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    borderWidth: 1,
    minHeight: 110,
  },
  label: {
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "600",
    fontSize: 13,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  amount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  currency: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
  },
  // Solde - Dégradé violet/bleu (aligné sur le header)
  solde: {
    backgroundColor: "#0c0c10ff",
    borderColor: "#0c0c10ff",
    shadowColor: "#0c0c10ff",
  },
  // Dépenses - Dégradé rouge sombre
  depenses: {
    backgroundColor: "#dc2626",
    borderColor: "#ef4444",
    shadowColor: "#dc2626",
  },
  // Revenus - Dégradé vert
  revenus: {
    backgroundColor: "#059669",
    borderColor: "#10b981",
    shadowColor: "#059669",
  },
});