import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";

export interface Libelle {
  nom: string;
  montant: string;
}

export interface Category {
  id: string;
  nom: string;
  icone: string;
  couleur: string;
}

export interface AddTransactionFormProps {
  position: "depense" | "revenu";
  setPosition: (v: "depense" | "revenu") => void;

  categories: Category[];
  loadingCategories: boolean;
  selectedCategoryId: string | null;
  onSelectCategory: (id: string) => void;
  onAddCategoryPress: () => void;

  libelles: Libelle[];
  libelleNom: string;
  setLibelleNom: (v: string) => void;
  libelleMontant: string;
  setLibelleMontant: (v: string) => void;
  onAddLibelle: () => void;
  onRemoveLibelle: (index: number) => void;

  commentaire: string;
  setCommentaire: (v: string) => void;

  submitting: boolean;
  onSubmit: () => void;
  onClose: () => void;

  showAddCategoryModal: boolean;
  newCategoryName: string;
  setNewCategoryName: (v: string) => void;
  onConfirmAddCategory: () => void;
  onCancelAddCategory: () => void;
}

export default function AddTransactionForm(props: AddTransactionFormProps) {
  const {
    position,
    setPosition,
    categories,
    loadingCategories,
    selectedCategoryId,
    onSelectCategory,
    onAddCategoryPress,
    libelles,
    libelleNom,
    setLibelleNom,
    libelleMontant,
    setLibelleMontant,
    onAddLibelle,
    onRemoveLibelle,
    commentaire,
    setCommentaire,
    submitting,
    onSubmit,
    onClose,
    showAddCategoryModal,
    newCategoryName,
    setNewCategoryName,
    onConfirmAddCategory,
    onCancelAddCategory,
  } = props;

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
        {/* TYPE */}
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

        {/* CATÉGORIE */}
        <Text style={styles.label}>CATÉGORIE *</Text>
        {loadingCategories ? (
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
                  onPress={() => onSelectCategory(cat.id)}
                >
                  <Text style={styles.catIcon}>{cat.icone}</Text>
                  <Text style={styles.catText}>{cat.nom}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity
                style={styles.catBtnAdd}
                onPress={onAddCategoryPress}
              >
                <Text style={styles.catIconAdd}>+</Text>
                <Text style={styles.catTextAdd}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* LIBELLÉS */}
        <Text style={styles.label}>LIBELLÉS *</Text>

        {libelles.map((l, i) => (
          <View key={i} style={styles.libelleRow}>
            <Text>
              {l.nom} — {l.montant}
            </Text>
            <TouchableOpacity onPress={() => onRemoveLibelle(i)}>
              <Text style={{ color: "red" }}>Supprimer</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.row}>
          <TextInput
            placeholder="Libellé"
            placeholderTextColor="#94A3B8"
            value={libelleNom}
            onChangeText={setLibelleNom}
            style={[styles.input, { flex: 1 }]}
          />
          <TextInput
            placeholder="Montant"
            placeholderTextColor="#94A3B8"
            value={libelleMontant}
            onChangeText={setLibelleMontant}
            keyboardType="decimal-pad"
            style={[styles.input, { width: 100 }]}
          />
        </View>

        <TouchableOpacity style={styles.btnAddLibelle} onPress={onAddLibelle}>
          <Text style={styles.btnAddLibelleText}>+ Ajouter libellé</Text>
        </TouchableOpacity>

        {/* COMMENTAIRE */}
        <Text style={styles.label}>COMMENTAIRE</Text>
        <TextInput
          placeholder="Ajouter une note..."
          placeholderTextColor="#94A3B8"
          value={commentaire}
          onChangeText={setCommentaire}
          multiline
          numberOfLines={3}
          style={[styles.input, styles.inputMulti]}
        />

        {/* SUBMIT */}
        <TouchableOpacity
          style={[styles.btnSubmit, submitting && styles.btnDisabled]}
          onPress={onSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnSubmitText}>✓ Enregistrer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* MODAL AJOUT CATÉGORIE */}
      <Modal visible={showAddCategoryModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Nouvelle catégorie</Text>

            <TextInput
              placeholder="Nom de la catégorie"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              style={styles.modalInput}
              autoFocus
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={onCancelAddCategory}
              >
                <Text style={styles.modalBtnCancelText}>Annuler</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalBtnOk}
                onPress={onConfirmAddCategory}
              >
                <Text style={styles.modalBtnOkText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

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
  btnBack: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  btnBackText: { fontSize: 28, color: "#64748B" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B" },

  form: { flex: 1, padding: 16 },
  label: { fontSize: 11, fontWeight: "700", color: "#64748B", letterSpacing: 1, marginTop: 16, marginBottom: 8 },
  row: { flexDirection: "row", gap: 12, marginBottom: 12 },

  btn: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 2, borderColor: "#E2E8F0", alignItems: "center", backgroundColor: "#fff" },
  btnDepense: { borderColor: "#EF4444", backgroundColor: "#FEE2E2" },
  btnRevenu: { borderColor: "#10B981", backgroundColor: "#D1FAE5" },
  btnIcon: { fontSize: 32, marginBottom: 8 },
  btnText: { fontSize: 14, fontWeight: "600", color: "#1E293B" },

  catRow: { flexDirection: "row", gap: 10 },
  catBtn: { minWidth: 100, padding: 12, borderRadius: 12, borderWidth: 2, borderColor: "#E2E8F0", alignItems: "center", backgroundColor: "#fff" },
  catIcon: { fontSize: 28, marginBottom: 4 },
  catText: { fontSize: 12, fontWeight: "600", color: "#1E293B" },
  catBtnAdd: { minWidth: 100, padding: 12, borderRadius: 12, borderWidth: 2, borderColor: "#CBD5E1", borderStyle: "dashed", alignItems: "center", backgroundColor: "#F8FAFC" },
  catIconAdd: { fontSize: 28, color: "#94A3B8", marginBottom: 4 },
  catTextAdd: { fontSize: 12, fontWeight: "600", color: "#64748B" },

  input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10, padding: 14, fontSize: 15, color: "#1E293B", marginBottom: 12 },
  inputMulti: { minHeight: 80, textAlignVertical: "top" },

  libelleRow: { flexDirection: "row", justifyContent: "space-between", padding: 10, backgroundColor: "#E5E7EB", borderRadius: 10, marginBottom: 6 },
  btnAddLibelle: { padding: 12, backgroundColor: "#2563EB", borderRadius: 12, alignItems: "center", marginBottom: 12 },
  btnAddLibelleText: { color: "#fff", fontWeight: "700" },

  btnSubmit: { padding: 18, backgroundColor: "#14B8A6", borderRadius: 14, alignItems: "center", marginTop: 24, marginBottom: 24 },
  btnSubmitText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  btnDisabled: { opacity: 0.5 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "#fff", borderRadius: 16, padding: 24, width: "85%", maxWidth: 400 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B", marginBottom: 16, textAlign: "center" },
  modalInput: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10, padding: 14, fontSize: 15, color: "#1E293B", marginBottom: 20 },
  modalBtns: { flexDirection: "row", gap: 12 },
  modalBtnCancel: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: "#F1F5F9", alignItems: "center" },
  modalBtnCancelText: { fontSize: 15, fontWeight: "600", color: "#64748B" },
  modalBtnOk: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: "#14B8A6", alignItems: "center" },
  modalBtnOkText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
