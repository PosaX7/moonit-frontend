// components/ButtonBudget.tsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

type Props = {
  onPress: () => void;
};

export default function ButtonBudget({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.plus}>+</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    bottom: 80,
    left: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#facc15",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },

  plus: {
    fontSize: 34,
    fontWeight: "700",
    color: "#000",
  },
});
