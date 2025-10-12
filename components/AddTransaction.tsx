import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { createTransaction, Transaction } from "../services/api";

type Props = {
  type: "revenu" | "depense";
  onAdded: (tx: Transaction) => void;
  onClose: () => void;
};

export default function AddTransaction({ type, onAdded, onClose }: Props) {
  const [libelle, setLibelle] = useState("");
  const [montant, setMontant] = useState("");
  const [categorie, setCategorie] = useState("");

  const handleSubmit = async () => {
    if (!libelle || !montant || !categorie) {
      alert("Merci de remplir tous les champs");
      return;
    }

    const data = {
      local_id: Date.now(),
      libelle,
      montant: parseFloat(montant),
      categorie,
      type,
    };

    console.log("Données envoyées au backend :", data);

    try {
      const newTx = await createTransaction(data);
      onAdded(newTx);
      onClose();
    } catch (err) {
      console.error("Erreur ajout:", err);
    }
  };

  const isDepense = type === "depense";

  return (
    <View style={styles.container}>
      {/* Titre minimaliste */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {isDepense ? "Dépense" : "Revenu"}
        </Text>
        <View style={[styles.badge, isDepense ? styles.badgeDepense : styles.badgeRevenu]}>
          <Text style={styles.badgeText}>{isDepense ? "−" : "+"}</Text>
        </View>
      </View>

      {/* Champs épurés */}
      <TextInput
        placeholder="Libellé"
        placeholderTextColor="#94a3b8"
        value={libelle}
        onChangeText={setLibelle}
        style={styles.input}
      />

      <TextInput
        placeholder="Catégorie"
        placeholderTextColor="#94a3b8"
        value={categorie}
        onChangeText={setCategorie}
        style={styles.input}
      />

      <TextInput
        placeholder="Montant"
        placeholderTextColor="#94a3b8"
        value={montant}
        onChangeText={setMontant}
        keyboardType="numeric"
        style={[styles.input, styles.inputMontant]}
      />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnSecondary} onPress={onClose}>
          <Text style={styles.btnSecondaryText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btnPrimary, isDepense ? styles.btnPrimaryDepense : styles.btnPrimaryRevenu]}
          onPress={handleSubmit}
        >
          <Text style={styles.btnPrimaryText}>Valider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    letterSpacing: -0.5,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeDepense: {
    backgroundColor: "#fee2e2",
  },
  badgeRevenu: {
    backgroundColor: "#d1fae5",
  },
  badgeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#1e293b",
    marginBottom: 12,
    fontWeight: "500",
  },
  inputMontant: {
    fontSize: 18,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  btnSecondary: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnSecondaryText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 15,
  },
  btnPrimary: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnPrimaryDepense: {
    backgroundColor: "#dc2626",
  },
  btnPrimaryRevenu: {
    backgroundColor: "#059669",
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});