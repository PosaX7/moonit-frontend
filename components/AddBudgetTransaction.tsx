import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from "react-native";
import { createTransaction, Transaction } from "../services/api";
import { X, Calendar } from "lucide-react-native";

type Props = {
  type: "revenu" | "depense";
  onAdded: (txs: Transaction[]) => void;
  onClose: () => void;
  onSuccess?: (count: number) => void;
};

export default function AddBudgetTransaction({ type, onAdded, onClose, onSuccess }: Props) {
  const [categorie, setCategorie] = useState("");
  const [libelle, setLibelle] = useState("");
  const [montant, setMontant] = useState("");
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [pickerDate, setPickerDate] = useState(new Date());

  const handleDateChange = (event: any, date?: Date) => {
    if (!date) return;

    const dateStr = date.toISOString().split("T")[0]; // Format YYYY-MM-DD

    if (selectedDates.includes(dateStr)) {
      // Déselectionner si déjà sélectionnée
      setSelectedDates(selectedDates.filter((d) => d !== dateStr));
    } else {
      // Ajouter la date
      setSelectedDates([...selectedDates, dateStr].sort());
    }

    setPickerDate(date);
  };

  const handleRemoveDate = (dateStr: string) => {
    setSelectedDates(selectedDates.filter((d) => d !== dateStr));
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleSubmit = async () => {
    if (!categorie || !libelle || !montant || selectedDates.length === 0) {
      alert("Remplis tous les champs et sélectionne au moins une date");
      return;
    }

    const parsedMontant = parseFloat(montant);
    if (isNaN(parsedMontant) || parsedMontant <= 0) {
      alert("Le montant doit être positif");
      return;
    }

    try {
      // Créer une transaction par date
      const transactions = selectedDates.map((date) => ({
        local_id: Math.floor(Date.now() * 1000 + Math.random() * 1000),
        libelle: libelle.trim(),
        montant: parsedMontant,
        categorie: categorie.trim(),
        type,
        module: "budget" as const,
        date,
      }));

      console.log("Budgets envoyés :", transactions);

      const createdTxs = await Promise.all(
        transactions.map((tx) => createTransaction(tx))
      );

      console.log("Budgets créés :", createdTxs);

      onAdded(createdTxs);
      onSuccess?.(createdTxs.length);

      // Réinitialiser
      setCategorie("");
      setLibelle("");
      setMontant("");
      setSelectedDates([]);
    } catch (err) {
      console.error("Erreur ajout:", err);
      alert("Erreur lors de l'ajout");
    }
  };

  const isDepense = type === "depense";

  return (
    <View style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {isDepense ? "Planifier Dépenses" : "Planifier Revenus"}
        </Text>
        <View style={[styles.badge, isDepense ? styles.badgeDepense : styles.badgeRevenu]}>
          <Text style={styles.badgeText}>{isDepense ? "−" : "+"}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Catégorie */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Catégorie *</Text>
          <TextInput
            placeholder="Ex: Transport, Logement..."
            placeholderTextColor="#94a3b8"
            value={categorie}
            onChangeText={setCategorie}
            style={styles.input}
          />
        </View>

        {/* Libellé */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Libellé *</Text>
          <TextInput
            placeholder="Ex: Carburant, Loyer..."
            placeholderTextColor="#94a3b8"
            value={libelle}
            onChangeText={setLibelle}
            style={styles.input}
          />
        </View>

        {/* Montant */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Montant *</Text>
          <TextInput
            placeholder="Ex: 150.50"
            placeholderTextColor="#94a3b8"
            value={montant}
            onChangeText={setMontant}
            keyboardType="decimal-pad"
            style={styles.input}
          />
          <Text style={styles.inputHint}>Format décimal: 25.99 ou 100</Text>
        </View>

        {/* Sélection des dates */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Dates * (sélectionne et ajoute)</Text>
          <View style={styles.dateInputRow}>
            <input
              type="date"
              value={pickerDate.toISOString().split("T")[0]}
              onChange={(e) => {
                const date = new Date(e.target.value + "T00:00:00");
                setPickerDate(date);
              }}
              style={styles.nativeInput}
            />
            <TouchableOpacity
              style={[styles.datePickerButton, isDepense ? styles.datePickerDepense : styles.datePickerRevenu]}
              onPress={() => {
                const dateStr = pickerDate.toISOString().split("T")[0];
                if (selectedDates.includes(dateStr)) {
                  setSelectedDates(selectedDates.filter((d) => d !== dateStr));
                } else {
                  setSelectedDates([...selectedDates, dateStr].sort());
                }
              }}
            >
              <Calendar size={18} color="#fff" />
              <Text style={styles.datePickerButtonText}>Ajouter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Dates sélectionnées */}
        {selectedDates.length > 0 && (
          <View style={styles.datesContainer}>
            <Text style={styles.datesTitle}>Dates sélectionnées :</Text>
            {selectedDates.map((date) => (
              <View key={date} style={styles.dateTag}>
                <Text style={styles.dateTagText}>{formatDateDisplay(date)}</Text>
                <TouchableOpacity onPress={() => handleRemoveDate(date)}>
                  <X size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>



      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.btnCancel} onPress={onClose}>
          <Text style={styles.btnCancelText}>Annuler</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btnSubmit,
            isDepense ? styles.btnSubmitDepense : styles.btnSubmitRevenu,
            selectedDates.length === 0 && styles.btnDisabled,
          ]}
          onPress={handleSubmit}
          disabled={selectedDates.length === 0}
        >
          <Text style={styles.btnSubmitText}>
            Valider ({selectedDates.length} date{selectedDates.length > 1 ? "s" : ""})
          </Text>
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
    maxHeight: "90%",
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
  scrollView: {
    marginBottom: 16,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: "#1e293b",
    fontWeight: "500",
  },
  inputHint: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
    marginLeft: 4,
  },
  dateInputRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginBottom: 12,
  },
  nativeInput: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    fontSize: 15,
    fontFamily: "inherit",
    backgroundColor: "#fff",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  datePickerDepense: {
    backgroundColor: "#dc2626",
  },
  datePickerRevenu: {
    backgroundColor: "#059669",
  },
  datePickerButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  datesContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  datesTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 8,
  },
  dateTag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  dateTagText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e293b",
  },
  datePickerModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  datePickerContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  datePickerDone: {
    backgroundColor: "#059669",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 16,
  },
  datePickerDoneText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  btnCancel: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnCancelText: {
    color: "#64748b",
    fontWeight: "600",
    fontSize: 15,
  },
  btnSubmit: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnSubmitDepense: {
    backgroundColor: "#dc2626",
  },
  btnSubmitRevenu: {
    backgroundColor: "#059669",
  },
  btnSubmitText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});