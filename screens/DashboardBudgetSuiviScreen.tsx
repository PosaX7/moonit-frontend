import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DashboardBudgetSuiviScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Comparaison Budget & Suivi</Text>
      <Text style={styles.subtitle}>Ici on mettra les graphiques combinés</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
  subtitle: { marginTop: 10, fontSize: 14, opacity: 0.6 },
});
