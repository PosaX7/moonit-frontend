import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { createTransaction, Transaction } from "../services/api";

type TransactionItem = {
  libelle: string;
  montant: string;
};

type Props = {
  type: "revenu" | "depense";
  onAdded: (txs: Transaction[]) => void;
  onClose: () => void;
};

export default function AddTransaction({ type, onAdded, onClose }: Props) {
  const [categorie, setCategorie] = useState("");
  const [libelle, setLibelle] = useState("");
  const [montant, setMontant] = useState("");
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [showNewItem, setShowNewItem] = useState(false);

  const handleAddItem = () => {
    if (!libelle || !montant) {
      alert("Merci de remplir le libellé et le montant");
      return;
    }

    const parsedMontant = parseFloat(montant);
    if (isNaN(parsedMontant) || parsedMontant <= 0) {
      alert("Le montant doit être un nombre positif");
      return;
    }

    const newItem: TransactionItem = {
      libelle,
      montant: parsedMontant.toString(),
    };

    setItems((prevItems) => [...prevItems, newItem]);
    setLibelle("");
    setMontant("");
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!categorie || items.length === 0) {
      alert("Merci de remplir la catégorie et d'ajouter au moins une dépense/revenu");
      return;
    }

    try {
      const transactions = items.map((item) => ({
        local_id: Date.now() + Math.random(),
        libelle: item.libelle,
        montant: parseFloat(item.montant),
        categorie,
        type,
      }));

      console.log("Transactions envoyées :", transactions);

      const createdTxs = await Promise.all(
        transactions.map((tx) => createTransaction(tx))
      );

      console.log("Transactions créées :", createdTxs);
      console.log("Type de createdTxs :", Array.isArray(createdTxs) ? "Array" : typeof createdTxs);
      if (Array.isArray(createdTxs)) {
        console.log("Première transaction :", createdTxs[0]);
      }

      onAdded(createdTxs);
      // Ne pas fermer le modal, réinitialiser le formulaire
      setItems([]);
      setCategorie("");
      setLibelle("");
      setMontant("");
      setShowNewItem(false);
    } catch (err) {
      console.error("Erreur ajout:", err);
    }
  };

  const total = items.reduce((sum, item) => sum + (parseFloat(item.montant) || 0), 0);
  const isDepense = type === "depense";

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>{isDepense ? "Dépenses" : "Revenus"}</Text>
        <View style={[styles.badge, isDepense ? styles.badgeDepense : styles.badgeRevenu]}>
          <Text style={styles.badgeText}>{isDepense ? "−" : "+"}</Text>
        </View>
      </View>

      {/* Catégorie avec total sur la même ligne */}
      <View style={styles.categorieRow}>
        <TextInput
          placeholder="Catégorie"
          placeholderTextColor="#94a3b8"
          value={categorie}
          onChangeText={setCategorie}
          style={[styles.input, styles.inputCategorie, { flex: 1, marginBottom: 0 }]}
          editable={items.length === 0}
        />
        {items.length > 0 && (
          <View style={styles.totalDisplay}>
            <Text style={styles.totalAmount}>{total.toFixed(2)}</Text>
          </View>
        )}
      </View>

      {/* Liste des items */}
      <ScrollView style={styles.itemsList}>
        {items.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <View style={styles.itemContent}>
              <Text style={styles.itemLibelle}>{item.libelle}</Text>
              <Text style={styles.itemMontant}>{parseFloat(item.montant).toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={styles.btnRemove}
              onPress={() => handleRemoveItem(index)}
            >
              <Text style={styles.btnRemoveText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      {/* Formulaire d'ajout */}
      {showNewItem && (
        <View style={styles.newItemForm}>
          <TextInput
            placeholder="Libellé"
            placeholderTextColor="#94a3b8"
            value={libelle}
            onChangeText={setLibelle}
            style={styles.input}
          />

          <View>
            <TextInput
              placeholder="Montant (ex: 22.50 ou 100)"
              placeholderTextColor="#94a3b8"
              value={montant}
              onChangeText={setMontant}
              keyboardType="decimal-pad"
              style={styles.input}
            />
            <Text style={styles.inputHint}>Utilisez le format décimal (ex: 25.99)</Text>
          </View>

          <View style={styles.formActions}>
            <TouchableOpacity
              style={styles.btnSmallSecondary}
              onPress={() => {
                setShowNewItem(false);
                setLibelle("");
                setMontant("");
              }}
            >
              <Text style={styles.btnSmallText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSmallPrimary, isDepense ? styles.btnSmallDepense : styles.btnSmallRevenu]}
              onPress={handleAddItem}
            >
              <Text style={styles.btnSmallPrimaryText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Bouton "Ajouter une dépense/revenu" */}
      {!showNewItem && (
        <TouchableOpacity
          style={[styles.btnAddItem, isDepense ? styles.btnAddItemDepense : styles.btnAddItemRevenu]}
          onPress={() => setShowNewItem(true)}
        >
          <Text style={styles.btnAddItemText}>
            + Ajouter {isDepense ? "une dépense" : "un revenu"} liée{isDepense ? "" : ""} à {categorie || "cette catégorie"}
          </Text>
        </TouchableOpacity>
      )}

      {/* Actions principales */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnSecondary} onPress={onClose}>
          <Text style={styles.btnSecondaryText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnPrimary,
            isDepense ? styles.btnPrimaryDepense : styles.btnPrimaryRevenu,
            items.length === 0 && styles.btnDisabled,
          ]}
          onPress={handleSubmit}
          disabled={items.length === 0}
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
    marginBottom: 16,
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
  inputCategorie: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },
  categorieRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  totalDisplay: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    minWidth: 100,
    alignItems: "flex-end",
  },
  totalBox: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalBoxDepense: {
    backgroundColor: "#fee2e2",
    borderLeftWidth: 4,
    borderLeftColor: "#dc2626",
  },
  totalBoxRevenu: {
    backgroundColor: "#d1fae5",
    borderLeftWidth: 4,
    borderLeftColor: "#059669",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  itemsList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#fbbf24",
  },
  itemContent: {
    flex: 1,
  },
  itemLibelle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 4,
  },
  itemMontant: {
    fontSize: 13,
    fontWeight: "700",
    color: "#64748b",
  },
  btnRemove: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
  },
  btnRemoveText: {
    fontSize: 16,
    color: "#dc2626",
    fontWeight: "bold",
  },
  newItemForm: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
  },
  formActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  btnSmallSecondary: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnSmallText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 13,
  },
  btnSmallPrimary: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  btnSmallDepense: {
    backgroundColor: "#dc2626",
  },
  btnSmallRevenu: {
    backgroundColor: "#059669",
  },
  btnSmallPrimaryText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
  btnAddItem: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  btnAddItemDepense: {
    borderColor: "#dc2626",
    backgroundColor: "#fef2f2",
  },
  btnAddItemRevenu: {
    borderColor: "#059669",
    backgroundColor: "#f0fdf4",
  },
  btnAddItemText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#1e293b",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
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
  btnDisabled: {
    opacity: 0.5,
  },
  inputHint: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
    marginLeft: 2,
  },
});