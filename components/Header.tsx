import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return (
    <View style={styles.container}>
      {/* Avatar avec dégradé */}
      <View style={styles.avatarContainer}>
        <View style={styles.profileBox}>
          <Text style={styles.profileEmoji}>🌙</Text>
        </View>
        <View style={styles.onlineBadge} />
      </View>

      {/* Spacer pour pousser le titre et la cloche à droite */}
      <View style={styles.spacer} />

      {/* Titre à droite */}
      <Text style={styles.title}>{title}</Text>

      {/* Icône notification */}
      <View style={styles.notificationBadge}>
        <Text style={styles.notificationIcon}>🔔</Text>
        <View style={styles.notificationDot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#0f172a",
    padding: 20,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  avatarContainer: {
    position: "relative",
  },
  profileBox: {
    width: 55,
    height: 55,
    backgroundColor: "#6366f1",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#818cf8",
  },
  profileEmoji: {
    fontSize: 28,
  },
  onlineBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#10b981",
    borderWidth: 2,
    borderColor: "#0f172a",
  },
  spacer: {
    flex: 1, // Prend tout l'espace disponible
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 24,
    letterSpacing: 0.5,
    marginRight: 15,
  },
  notificationBadge: {
    position: "relative",
    width: 44,
    height: 44,
    backgroundColor: "#1e293b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  notificationIcon: {
    fontSize: 20,
  },
  notificationDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },
});