import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  onFilterChange?: (filter: string | null) => void;
};

const SuiviFiltreMini: React.FC<Props> = ({ onFilterChange }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => onFilterChange?.("today")}
      >
        <Text style={styles.txt}>Aujourd’hui</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => onFilterChange?.("week")}
      >
        <Text style={styles.txt}>Cette semaine</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => onFilterChange?.("month")}
      >
        <Text style={styles.txt}>Ce mois</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => onFilterChange?.("all")}
      >
        <Text style={styles.txt}>Tout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
  },
  btn: {
    backgroundColor: "#14B8A6",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  txt: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default SuiviFiltreMini;
