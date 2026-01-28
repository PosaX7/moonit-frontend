import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function DashboardSuiviScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📈 Dashboard Suivi</Text>
      <Text style={styles.subtitle}>Suivi des transactions & flux financiers</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold" },
  subtitle: { marginTop: 10, fontSize: 14, opacity: 0.6 },
});
