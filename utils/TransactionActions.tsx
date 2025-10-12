import React, { useState } from "react";
import { Alert, Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { deleteTransaction } from "../services/api";
import { Transaction } from "../services/api";

export const useTransactionActions = (
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>
) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Fonction pour ouvrir la confirmation
  const confirmDelete = (id: number) => {
    setSelectedId(id);
    setModalVisible(true);
  };

  // Supprimer la transaction sans rechargement de la liste
  const handleDelete = async () => {
    if (selectedId === null) return;
    try {
      // Suppression backend
      await deleteTransaction(selectedId);
      // Suppression immédiate frontend
      setTransactions((prev) =>
        prev.filter((t) => t.id !== selectedId)
      );
    } catch (error) {
      Alert.alert("Erreur", "Impossible de supprimer la transaction.");
    } finally {
      setModalVisible(false);
      setSelectedId(null);
    }
  };

  // Le composant du pop-up
  const ConfirmationModal = () => (
    <Modal
      transparent
      animationType="fade"
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Supprimer cette transaction ?</Text>
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.button, styles.deleteButton]}
            >
              <Text style={styles.buttonText}>Supprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.button, styles.cancelButton]}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return { confirmDelete, ConfirmationModal };
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    width: "80%",
    elevation: 5,
  },
  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteButton: {
    backgroundColor: "#e74c3c",
  },
  cancelButton: {
    backgroundColor: "#95a5a6",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
