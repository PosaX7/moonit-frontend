// components/AddBudgetTransaction.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { createTransaction, Transaction } from "../services/api";

interface AddBudgetTransactionProps {
  type: "revenu" | "depense";
  onAdded: (transaction: Transaction) => void;
  onClose: () => void;
}

export default function AddBudgetTransaction({ type, onAdded, onClose }: AddBudgetTransactionProps) {
  const [libelle, setLibelle] = useState("");
  const [categorie, setCategorie] = useState("");
  const [montant, setMontant] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validation : libellé et catégorie obligatoires
    if (!libelle.trim() || !categorie.trim()) {
      alert("Le libellé et la catégorie sont obligatoires !");
      return;
    }

    setLoading(true);
    try {
      const newTransaction = await createTransaction({
        libelle: libelle.trim(),
        categorie: categorie.trim(),
        montant: montant ? parseInt(montant) : 0,
        type,
        module: "budget",
        local_id: 0, // Géré automatiquement par le backend
      });

      onAdded(newTransaction);
      onClose();
      
      // Réinitialiser le formulaire
      setLibelle("");
      setCategorie("");
      setMontant("");
      setDate("");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      alert("Échec de l'ajout de la transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, type === "depense" ? styles.depenseContainer : styles.revenuContainer]}>
      <Text style={styles.title}>
        {type === "depense" ? "Planifier une Dépense" : "Planifier un Revenu"}
      </Text>

      {/* Libellé - OBLIGATOIRE */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Libellé *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Loyer, Salaire..."
          value={libelle}
          onChangeText={setLibelle}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Catégorie - OBLIGATOIRE */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Catégorie *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Logement, Travail..."
          value={categorie}
          onChangeText={setCategorie}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Montant - OPTIONNEL */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Montant (optionnel)</Text>
        <TextInput
          style={styles.input}
          placeholder="0"
          value={montant}
          onChangeText={setMontant}
          keyboardType="numeric"
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Date - OPTIONNEL */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date (optionnel)</Text>
        <TextInput
          style={styles.input}
          placeholder="JJ/MM/AAAA"
          value={date}
          onChangeText={setDate}
          placeholderTextColor="#9ca3af"
        />
      </View>

      {/* Boutons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelButtonText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Ajouter</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  depenseContainer: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  revenuContainer: {
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
    letterSpacing: 0.3,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: "#f9fafb",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#111827",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#6b7280",
    fontWeight: "600",
    fontSize: 16,
  },
  submitButton: {
    flex: 1,
    backgroundColor: "#10b981",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#10b981",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: "#9ca3af",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },
});