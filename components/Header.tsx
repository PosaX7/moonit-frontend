import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return (
    <View style={styles.container}>
      {/* Carré profil à gauche */}
      <View style={styles.profileBox}>
        <Text style={styles.profileText}>U</Text>
      </View>

      {/* Titre à droite */}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#000",
    padding: 15,
    alignItems: "center",
  },
  profileBox: {
    width: 40,
    height: 40,
    backgroundColor: "#555",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    flex: 1,
    textAlign: "right",
  },
});
