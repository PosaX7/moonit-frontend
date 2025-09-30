import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  totalRevenus: number;
  totalDepenses: number;
  solde: number;
};

export default function TopBubbles({ totalRevenus, totalDepenses, solde }: Props) {
  // Fonction pour formater avec séparateur de milliers
  const formatMontant = (montant: number) =>
    montant.toLocaleString("fr-FR", { minimumFractionDigits: 0 });

  return (
    <View style={styles.container}>
      <View style={[styles.bubble, styles.solde]}>
        <Text style={styles.label}>Solde</Text>
        <Text style={styles.amount}>{formatMontant(solde)}</Text>
      </View>

      <View style={[styles.bubble, styles.depenses]}>
        <Text style={styles.label}>Dépenses</Text>
        <Text style={styles.amount}>{formatMontant(totalDepenses)}</Text>
      </View>

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
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  bubble: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { color: "#fff", fontWeight: "bold", marginBottom: 5 },
  amount: { color: "#fff", fontSize: 16 },
  solde: { backgroundColor: "#222" },
  depenses: { backgroundColor: "#e74c3c" },
  revenus: { backgroundColor: "#27ae60" },
});
