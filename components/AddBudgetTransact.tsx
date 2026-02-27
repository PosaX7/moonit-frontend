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
  Platform,
} from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
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

type Libelle = {
  nom: string;
  montant: number;
  date: string;
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

  // 3. LIBELLÉS MULTIPLES
  const [libelles, setLibelles] = useState<Libelle[]>([]);
  const [libelleNom, setLibelleNom] = useState("");
  const [libelleMontant, setLibelleMontant] = useState("");
  const [libelleDate, setLibelleDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 4. COMMENTAIRE GLOBAL
  const [commentaire, setCommentaire] = useState("");

  // 5. SOUMISSION
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

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatDateDisplay = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getDateIndicator = (dateString: string): string => {
    const selectedDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    
    if (selectedDate.getTime() === today.getTime()) {
      return "📅 Aujourd'hui";
    } else if (selectedDate < today) {
      return "📅 Passée";
    } else {
      return "📅 Future";
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Sur Android, ferme toujours le picker après sélection
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (selectedDate) {
      setLibelleDate(selectedDate);
    }
  };

  const handleAddLibelle = () => {
    if (!libelleNom.trim()) {
      Alert.alert("Attention", "Entrez un libellé");
      return;
    }
    const montantNum = parseFloat(libelleMontant);
    if (isNaN(montantNum) || montantNum <= 0) {
      Alert.alert("Attention", "Le montant doit être supérieur à 0");
      return;
    }

    setLibelles([...libelles, { 
      nom: libelleNom.trim(), 
      montant: montantNum, 
      date: formatDate(libelleDate)
    }]);
    setLibelleNom("");
    setLibelleMontant("");
    setLibelleDate(new Date());
  };

  const handleRemoveLibelle = (index: number) => {
    const newLibelles = [...libelles];
    newLibelles.splice(index, 1);
    setLibelles(newLibelles);
  };

  const handleSubmit = async () => {
    if (!selectedCategoryId) {
      Alert.alert("Attention", "Sélectionnez une catégorie");
      return;
    }
    if (libelles.length === 0) {
      Alert.alert("Attention", "Ajoutez au moins un libellé");
      return;
    }

    try {
      setSubmitting(true);

      const transactionData = {
        position,
        categorie_id: selectedCategoryId,
        volet,
        libelles: libelles.map((l) => ({
          nom: l.nom,
          montant: l.montant,
          date: l.date,
          commentaire: commentaire.trim(),
        })),
      };

      console.log("📤 Envoi transaction:", JSON.stringify(transactionData, null, 2));
      const result = await createTransactionAPI(transactionData);
      console.log("✅ Transaction créée:", result);

      onTransactionAdded();
      Alert.alert("Succès", "Transaction ajoutée !");

      // Reset
      setLibelles([]);
      setLibelleNom("");
      setLibelleMontant("");
      setLibelleDate(new Date());
      setCommentaire("");
      setSelectedCategoryId("");
    } catch (error: any) {
      console.error("❌ Erreur création transaction:", error);
      const errorMsg = error.response?.data?.detail 
        || error.response?.data?.message 
        || "Impossible d'ajouter la transaction";
      Alert.alert("Erreur", errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
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
        {/* Type */}
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

        {/* Catégorie */}
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

        {/* Libellés multiples */}
        <Text style={styles.label}>LIBELLÉS *</Text>
        <Text style={styles.sublabel}>
          {volet === "budget" 
            ? "Planifiez vos dépenses/revenus futurs avec des dates à venir" 
            : "Enregistrez vos transactions passées ou planifiez les futures"}
        </Text>
        
        {libelles.map((l, i) => (
          <View key={i} style={styles.libelleRow}>
            <View style={styles.libelleInfo}>
              <Text style={styles.libelleNom}>{l.nom}</Text>
              <Text style={styles.libelleDetails}>
                {l.montant.toLocaleString()} XAF • {getDateIndicator(l.date)} • {formatDateDisplay(l.date)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveLibelle(i)}>
              <Text style={styles.libelleDelete}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.libelleInputContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom du libellé</Text>
            <TextInput
              placeholder="Ex: Loyer janvier"
              placeholderTextColor="#94A3B8"
              value={libelleNom}
              onChangeText={setLibelleNom}
              style={styles.input}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Montant (XAF)</Text>
            <TextInput
              placeholder="Ex: 50000"
              placeholderTextColor="#94A3B8"
              value={libelleMontant}
              onChangeText={setLibelleMontant}
              keyboardType="decimal-pad"
              style={styles.input}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Date</Text>
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerIcon}>📅</Text>
              <Text style={styles.datePickerText}>
                {formatDateDisplay(formatDate(libelleDate))}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && Platform.OS !== 'web' && (
          <View>
            <DateTimePicker
              value={libelleDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
            {Platform.OS === 'ios' && (
              <TouchableOpacity 
                style={styles.btnClosePicker} 
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.btnClosePickerText}>✓ Valider</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Calendrier web */}
        {showDatePicker && Platform.OS === 'web' && (
          <View style={styles.webDatePickerContainer}>
            <input
              type="date"
              value={formatDate(libelleDate)}
              onChange={(e) => {
                const selectedDate = new Date(e.target.value);
                setLibelleDate(selectedDate);
              }}
              style={{
                padding: 12,
                fontSize: 15,
                borderRadius: 8,
                border: '2px solid #14B8A6',
                backgroundColor: '#fff',
                color: '#1E293B',
                width: '100%',
                marginBottom: 8,
              }}
            />
            <TouchableOpacity 
              style={styles.btnClosePicker} 
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.btnClosePickerText}>✓ Valider</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.btnAddLibelle} onPress={handleAddLibelle}>
          <Text style={styles.btnAddLibelleText}>+ Ajouter libellé</Text>
        </TouchableOpacity>

        {/* Commentaire */}
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

        {/* Enregistrer */}
        <TouchableOpacity
          style={[styles.btnSubmit, submitting && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnSubmitText}>✓ Enregistrer</Text>}
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#E2E8F0" },
  btnBack: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  btnBackText: { fontSize: 28, color: "#64748B" },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B" },
  form: { flex: 1, padding: 16 },
  label: { fontSize: 11, fontWeight: "700", color: "#64748B", letterSpacing: 1, marginTop: 16, marginBottom: 8 },
  sublabel: { fontSize: 11, color: "#94A3B8", marginBottom: 12, fontStyle: "italic" },
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
  input: { 
    backgroundColor: "#fff", 
    borderWidth: 1, 
    borderColor: "#E2E8F0", 
    borderRadius: 10, 
    padding: 14, 
    fontSize: 15, 
    color: "#1E293B",
  },
  inputMulti: { minHeight: 80, textAlignVertical: "top" },
  btnSubmit: { padding: 18, backgroundColor: "#14B8A6", borderRadius: 14, alignItems: "center", marginTop: 24, marginBottom: 24 },
  btnSubmitText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  btnDisabled: { opacity: 0.5 },
  btnAddLibelle: { padding: 14, backgroundColor: "#2563EB", borderRadius: 12, alignItems: "center", marginBottom: 12 },
  btnAddLibelleText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  libelleRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center",
    padding: 14, 
    backgroundColor: "#fff", 
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10, 
    marginBottom: 8 
  },
  libelleInfo: { flex: 1 },
  libelleNom: { fontSize: 15, fontWeight: "600", color: "#1E293B", marginBottom: 4 },
  libelleDetails: { fontSize: 13, color: "#64748B" },
  libelleDelete: { fontSize: 20, color: "#EF4444", fontWeight: "700", paddingHorizontal: 8 },
  libelleInputContainer: { 
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 6,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    padding: 14,
    gap: 10,
    minHeight: 50,
  },
  datePickerIcon: {
    fontSize: 20,
  },
  datePickerText: {
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "600",
    flex: 1,
  },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: "center", alignItems: "center" },
  modalBox: { backgroundColor: "#fff", borderRadius: 16, padding: 24, width: "85%", maxWidth: 400 },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#1E293B", marginBottom: 8, textAlign: "center" },
  modalSubtitle: { fontSize: 14, fontWeight: "600", color: "#64748B", marginBottom: 16, textAlign: "center" },
  modalInput: { backgroundColor: "#F8FAFC", borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 10, padding: 14, fontSize: 15, color: "#1E293B", marginBottom: 20 },
  modalBtns: { flexDirection: "row", gap: 12 },
  modalBtnCancel: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: "#F1F5F9", alignItems: "center" },
  modalBtnCancelText: { fontSize: 15, fontWeight: "600", color: "#64748B" },
  modalBtnOk: { flex: 1, padding: 14, borderRadius: 10, backgroundColor: "#14B8A6", alignItems: "center" },
  modalBtnOkText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  btnClosePicker: { 
    padding: 14, 
    backgroundColor: "#14B8A6", 
    borderRadius: 10, 
    alignItems: "center", 
    marginTop: 10,
    marginBottom: 12,
  },
  btnClosePickerText: { 
    fontSize: 15, 
    fontWeight: "700", 
    color: "#fff" 
  },
  webDatePickerContainer: {
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#14B8A6',
    marginBottom: 12,
  },
});
