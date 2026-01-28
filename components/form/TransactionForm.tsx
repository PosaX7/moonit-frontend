// TransactionForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type Libelle = {
  nom: string;
  montant: number;
};

export type TransactionFormValues = {
  position: "depense" | "revenu";
  categorieId: string;
  libelles: Libelle[];
  commentaire: string;
  date: Date;
};

type Categorie = {
  id: string;
  nom: string;
  icone: string;
  couleur: string;
};

type Props = {
  categories: Categorie[];
  loadingCategories: boolean;
  showDate: boolean;
  submitting: boolean;
  onSubmit: (values: TransactionFormValues) => void;
  onAddCategory: (name: string, position: "depense" | "revenu") => void;
  onClose: () => void;
};

export default function TransactionForm({
  categories,
  loadingCategories,
  showDate,
  submitting,
  onSubmit,
  onAddCategory,
  onClose,
}: Props) {
  const [position, setPosition] = useState<"depense" | "revenu">("depense");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [libelles, setLibelles] = useState<Libelle[]>([]);
  const [libelleNom, setLibelleNom] = useState("");
  const [libelleMontant, setLibelleMontant] = useState("");
  const [commentaire, setCommentaire] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const addLibelle = () => {
    const montant = parseFloat(libelleMontant);
    if (!libelleNom.trim() || isNaN(montant) || montant <= 0) {
      Alert.alert("Erreur", "Libellé ou montant invalide");
      return;
    }
    setLibelles([...libelles, { nom: libelleNom.trim(), montant }]);
    setLibelleNom("");
    setLibelleMontant("");
  };

  const removeLibelle = (index: number) => {
    setLibelles(libelles.filter((_, i) => i !== index));
  };

  const submit = () => {
    if (!selectedCategoryId || libelles.length === 0) {
      Alert.alert("Erreur", "Veuillez sélectionner une catégorie et ajouter au moins un libellé");
      return;
    }

    onSubmit({
      position,
      categorieId: selectedCategoryId,
      libelles,
      commentaire,
      date: selectedDate,
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Nouvelle transaction</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* Type */}
        <Text style={styles.label}>TYPE</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.typeBtn,
              position === "depense" && styles.typeBtnActiveDepense,
            ]}
            onPress={() => setPosition("depense")}
          >
            <Text style={styles.typeIcon}>💸</Text>
            <Text style={[
              styles.typeText,
              position === "depense" && styles.typeTextActive
            ]}>Dépense</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.typeBtn,
              position === "revenu" && styles.typeBtnActiveRevenu,
            ]}
            onPress={() => setPosition("revenu")}
          >
            <Text style={styles.typeIcon}>💰</Text>
            <Text style={[
              styles.typeText,
              position === "revenu" && styles.typeTextActive
            ]}>Revenu</Text>
          </TouchableOpacity>
        </View>

        {/* Date */}
        <Text style={styles.label}>DATE</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateIcon}>📅</Text>
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={(e, d) => {
              setShowDatePicker(false);
              if (d) setSelectedDate(d);
            }}
          />
        )}

        {/* Catégories */}
        <Text style={styles.label}>CATÉGORIE</Text>
        {loadingCategories ? (
          <ActivityIndicator size="large" color="#14B8A6" style={{ marginVertical: 20 }} />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[
                  styles.catBtn,
                  selectedCategoryId === c.id && {
                    backgroundColor: c.couleur + "20",
                    borderColor: c.couleur,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => setSelectedCategoryId(c.id)}
              >
                <Text style={styles.catIcon}>{c.icone}</Text>
                <Text style={styles.catText}>{c.nom}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.catAddBtn}
              onPress={() => setShowAddCatModal(true)}
            >
              <Text style={styles.catAddIcon}>＋</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* Libellés */}
        <Text style={styles.label}>LIBELLÉS</Text>
        {libelles.map((l, i) => (
          <View key={i} style={styles.libelleItem}>
            <View style={styles.libelleContent}>
              <Text style={styles.libelleName}>{l.nom}</Text>
              <Text style={styles.libelleMontant}>{l.montant.toLocaleString()} FCFA</Text>
            </View>
            <TouchableOpacity onPress={() => removeLibelle(i)} style={styles.removeBtn}>
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.libelleInputRow}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            placeholder="Nom du libellé"
            placeholderTextColor="#9CA3AF"
            value={libelleNom}
            onChangeText={setLibelleNom}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Montant"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
            value={libelleMontant}
            onChangeText={setLibelleMontant}
          />
        </View>

        <TouchableOpacity style={styles.addLibelleBtn} onPress={addLibelle}>
          <Text style={styles.addLibelleIcon}>＋</Text>
          <Text style={styles.addLibelleText}>Ajouter un libellé</Text>
        </TouchableOpacity>

        {/* Commentaire */}
        <Text style={styles.label}>COMMENTAIRE (optionnel)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Ajouter une note..."
          placeholderTextColor="#9CA3AF"
          multiline
          numberOfLines={4}
          value={commentaire}
          onChangeText={setCommentaire}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
          disabled={submitting}
          onPress={submit}
          activeOpacity={0.8}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Enregistrer la transaction</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modal Ajouter Catégorie */}
      <Modal visible={showAddCatModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nouvelle catégorie</Text>
            <TextInput
              placeholder="Nom de la catégorie"
              placeholderTextColor="#9CA3AF"
              value={newCatName}
              onChangeText={setNewCatName}
              style={styles.modalInput}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalCancelBtn]}
                onPress={() => {
                  setNewCatName("");
                  setShowAddCatModal(false);
                }}
              >
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.modalConfirmBtn]}
                onPress={() => {
                  if (newCatName.trim()) {
                    onAddCategory(newCatName, position);
                    setNewCatName("");
                    setShowAddCatModal(false);
                  }
                }}
              >
                <Text style={styles.modalConfirmText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  closeIcon: {
    fontSize: 20,
    color: "#6B7280",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  form: {
    flex: 1,
    paddingHorizontal: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
    marginTop: 24,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  typeBtnActiveDepense: {
    backgroundColor: "#FEF2F2",
    borderColor: "#EF4444",
  },
  typeBtnActiveRevenu: {
    backgroundColor: "#F0FDF4",
    borderColor: "#22C55E",
  },
  typeIcon: {
    fontSize: 20,
  },
  typeText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
  typeTextActive: {
    color: "#111827",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  dateIcon: {
    fontSize: 20,
  },
  dateText: {
    fontSize: 15,
    color: "#111827",
    flex: 1,
  },
  categoriesScroll: {
    marginBottom: 8,
  },
  catBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 12,
    minWidth: 90,
    gap: 6,
  },
  catIcon: {
    fontSize: 28,
  },
  catText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  catAddBtn: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderStyle: "dashed",
    minWidth: 90,
  },
  catAddIcon: {
    fontSize: 24,
    color: "#9CA3AF",
  },
  libelleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    marginBottom: 8,
  },
  libelleContent: {
    flex: 1,
  },
  libelleName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  libelleMontant: {
    fontSize: 14,
    color: "#6B7280",
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
  },
  removeBtnText: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "600",
  },
  libelleInputRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  input: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
    color: "#111827",
  },
  addLibelleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginTop: 12,
    gap: 8,
  },
  addLibelleIcon: {
    fontSize: 18,
    color: "#2563EB",
  },
  addLibelleText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2563EB",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  submitBtn: {
    padding: 18,
    borderRadius: 14,
    backgroundColor: "#14B8A6",
    alignItems: "center",
    marginTop: 32,
    shadowColor: "#14B8A6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
    marginBottom: 20,
  },
  modalInput: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    fontSize: 15,
    color: "#111827",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  modalCancelBtn: {
    backgroundColor: "#F3F4F6",
  },
  modalConfirmBtn: {
    backgroundColor: "#14B8A6",
  },
  modalCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
  modalConfirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});