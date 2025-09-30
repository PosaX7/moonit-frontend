import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { createTransaction, Transaction } from "../services/api";

type Props = {
  type: "revenu" | "depense";
  onAdded: (tx: Transaction) => void; // callback pour renvoyer la nouvelle transaction
  onClose: () => void; // callback pour fermer la bulle
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
      libelle,
      montant: parseFloat(montant),
      categorie,
      type,
    };

    // 👉 Log pour voir ce que le frontend envoie
    console.log("Données envoyées au backend :", data);

    try {
      const newTx = await createTransaction(data);
      onAdded(newTx); // renvoyer la nouvelle transaction
      onClose(); // fermer la bulle
    } catch (err) {
      console.error("Erreur ajout:", err);
    }
  };

  return (
    <View style={styles.formBubble}>
      <Text style={styles.formTitle}>
        {type === "depense" ? "Nouvelle Dépense" : "Nouveau Revenu"}
      </Text>
      <TextInput
        placeholder="Libellé"
        value={libelle}
        onChangeText={setLibelle}
        style={styles.input}
      />
      <TextInput
        placeholder="Catégorie"
        value={categorie}
        onChangeText={setCategorie}
        style={styles.input}
      />
      <TextInput
        placeholder="Montant"
        value={montant}
        onChangeText={setMontant}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button
        title="Valider"
        onPress={handleSubmit}
        color={type === "depense" ? "red" : "green"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  formBubble: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  formTitle: { fontWeight: "bold", marginBottom: 10, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ddddddff",
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
});
