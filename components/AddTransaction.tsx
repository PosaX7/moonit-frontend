import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { 
  fetchCategories, 
  createCategorie,
  createTransaction as createTransactionAPI 
} from "../services/api";
import type { Categorie } from "../services/api";

type Props = {
  volet: "suivi" | "budget";
  onTransactionAdded: () => void;
  onClose: () => void;
};

export default function AddTransaction({ volet, onTransactionAdded, onClose }: Props) {
  // 1. POSITION
  const [position, setPosition] = useState<"depense" | "revenu">("depense");
  
  // 2. CATÉGORIE
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [loadingCat, setLoadingCat] = useState(false);
  
  // Modal ajout catégorie
  const [showAddCatModal, setShowAddCatModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  
  // 3. LIBELLÉ
  const [nom, setNom] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [montant, setMontant] = useState("");
  const [commentaire, setCommentaire] = useState("");
  
  // 4. SOUMISSION
  const [submitting, setSubmitting] = useState(false);

  // Charger catégories au changement de position
  useEffect(() => {
    loadCategories();
  }, [position]);

  const loadCategories = async () => {
    try {
      setLoadingCat(true);
      const cats = await fetchCategories(position);
      setCategories(cats);
      setSelectedCategoryId("");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de charger les catégories");
    } finally {
      setLoadingCat(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim()) {
      Alert.alert("Attention", "Entrez un nom de catégorie");
      return;
    }

    try {
      setLoadingCat(true);
      const newCat = await createCategorie({
        nom: newCatName.trim(),
        type_categorie: position,
        icone: position === "depense" ? "💸" : "💰",
        couleur: position === "depense" ? "#EF4444" : "#10B981",
      });

      await loadCategories();
      setSelectedCategoryId(newCat.id);
      setShowAddCatModal(false);
      setNewCatName("");
      Alert.alert("Succès", "Catégorie ajoutée !");
    } catch (error) {
      Alert.alert("Erreur", "Impossible de créer la catégorie");
    } finally {
      setLoadingCat(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!selectedCategoryId) {
      Alert.alert("Attention", "Sélectionnez une catégorie");
      return;
    }
    if (!nom.trim()) {
      Alert.alert("Attention", "Entrez un libellé");
      return;
    }
    if (!montant || parseFloat(montant) <= 0) {
      Alert.alert("Attention", "Entrez un montant valide");
      return;
    }

    try {
      setSubmitting(true);

      const transactionData = {
        position,
        categorie_id: selectedCategoryId,
        volet,
        libelles: [
          {
            nom: nom.trim(),
            date,
            montant: parseFloat(montant),
            commentaire: commentaire.trim() || "",
          },
        ],
      };

      console.log("📤 Envoi transaction:", JSON.stringify(transactionData, null, 2));

      const result = await createTransactionAPI(transactionData);
      
      console.log("✅ Transaction créée:", JSON.stringify(result, null, 2));

      // ✅ CORRECTION : Appeler uniquement onTransactionAdded
      // Le composant parent (AddTransactionButton) fermera le modal automatiquement
      console.log("📱 Appel de onTransactionAdded");
      onTransactionAdded();

      // Afficher le message de succès
      Alert.alert("Succès", "Transaction ajoutée !");

    } catch (error: any) {
      console.error("❌ Erreur création transaction:", error);
      console.error("❌ Détails erreur:", error.response?.data);
      
      const errorMsg = error.response?.data?.detail 
        || error.response?.data?.message 
        || "Impossible d'ajouter la transaction";
      
      Alert.alert("Erreur", errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.btnBack}>
          <Text style={styles.btnBackText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouvelle transaction</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        {/* 1. POSITION */}
        <Text style={styles.label}>TYPE *</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.btn, position === "depense" && styles.btnDepense]}
            onPress={() => setPosition("depense")}
          >
            <Text style={styles.btnIcon}>💸</Text>
            <Text style={styles.btnText}>Dépense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, position === "revenu" && styles.btnRevenu]}
            onPress={() => setPosition("revenu")}
          >
            <Text style={styles.btnIcon}>💰</Text>
            <Text style={styles.btnText}>Revenu</Text>
          </TouchableOpacity>
        </View>

        {/* 2. CATÉGORIE */}
        <Text style={styles.label}>CATÉGORIE *</Text>
        {loadingCat ? (
          <ActivityIndicator size="large" color="#14B8A6" />
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.catRow}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={[
                    styles.catBtn,
                    selectedCategoryId === cat.id && {
                      borderColor: cat.couleur,
                      backgroundColor: cat.couleur + "20",
                    },
                  ]}
                  onPress={() => setSelectedCategoryId(cat.id)}
                >
                  <Text style={styles.catIcon}>{cat.icone}</Text>
                  <Text style={styles.catText}>{cat.nom}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.catBtnAdd}
                onPress={() => setShowAddCatModal(true)}
              >
                <Text style={styles.catIconAdd}>+</Text>
                <Text style={styles.catTextAdd}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* 3. LIBELLÉ */}
        <Text style={styles.label}>LIBELLÉ *</Text>
        <TextInput
          placeholder="Ex: Consultation médecin"
          placeholderTextColor="#94A3B8"
          value={nom}
          onChangeText={setNom}
          style={styles.input}
        />

        <Text style={styles.label}>MONTANT (XAF) *</Text>
        <TextInput
          placeholder="Ex: 15000"
          placeholderTextColor="#94A3B8"
          value={montant}
          onChangeText={setMontant}
          keyboardType="decimal-pad"
          style={styles.input}
        />

        <Text style={styles.label}>DATE *</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
          style={styles.input}
        />

        <Text style={styles.label}>COMMENTAIRE (optionnel)</Text>
        <TextInput
          placeholder="Ajouter une note..."
          placeholderTextColor="#94A3B8"
          value={commentaire}
          onChangeText={setCommentaire}
          multiline
          numberOfLines={3}
          style={[styles.input, styles.inputMulti]}
        />

        {/* BOUTON ENREGISTRER */}
        <TouchableOpacity
          style={[styles.btnSubmit, submitting && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnSubmitText}>✓ Enregistrer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal ajout catégorie */}
      <Modal
        visible={showAddCatModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowAddCatModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowAddCatModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nouvelle catégorie</Text>
            <Text style={styles.modalSubtitle}>
              Type: {position === "depense" ? "Dépense 💸" : "Revenu 💰"}
            </Text>

            <TextInput
              placeholder="Nom de la catégorie"
              placeholderTextColor="#94A3B8"
              value={newCatName}
              onChangeText={setNewCatName}
              style={styles.modalInput}
              autoFocus
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => {
                  setShowAddCatModal(false);
                  setNewCatName("");
                }}
              >
                <Text style={styles.modalBtnCancelText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtnOk}
                onPress={handleAddCategory}
                disabled={!newCatName.trim()}
              >
                <Text style={styles.modalBtnOkText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  btnBack: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  btnBackText: {
    fontSize: 28,
    color: "#64748B",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  form: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  btn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  btnDepense: {
    borderColor: "#EF4444",
    backgroundColor: "#FEE2E2",
  },
  btnRevenu: {
    borderColor: "#10B981",
    backgroundColor: "#D1FAE5",
  },
  btnIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  btnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  catRow: {
    flexDirection: "row",
    gap: 10,
  },
  catBtn: {
    minWidth: 100,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  catIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  catText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E293B",
  },
  catBtnAdd: {
    minWidth: 100,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    borderStyle: "dashed",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  catIconAdd: {
    fontSize: 28,
    color: "#94A3B8",
    marginBottom: 4,
  },
  catTextAdd: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#1E293B",
  },
  inputMulti: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  btnSubmit: {
    padding: 18,
    backgroundColor: "#14B8A6",
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 24,
  },
  btnSubmitText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  btnDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: "#1E293B",
    marginBottom: 20,
  },
  modalBtns: {
    flexDirection: "row",
    gap: 12,
  },
  modalBtnCancel: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
  },
  modalBtnCancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#64748B",
  },
  modalBtnOk: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#14B8A6",
    alignItems: "center",
  },
  modalBtnOkText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#fff",
  },
});