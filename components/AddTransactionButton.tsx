import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Modal } from "react-native";
import AddTransaction from "./AddTransaction";

type Props = {
  volet: "suivi" | "budget";
  onTransactionAdded?: () => void;
};

export default function AddTransactionButton({ volet, onTransactionAdded }: Props) {
  const [showModal, setShowModal] = useState(false);

  const handleTransactionAdded = () => {
    console.log("🔄 AddTransactionButton: Transaction ajoutée, fermeture modal");
    setShowModal(false);
    
    // ✅ Appeler le callback du parent pour recharger les transactions
    if (onTransactionAdded) {
      console.log("🔄 AddTransactionButton: Appel de onTransactionAdded");
      onTransactionAdded();
    }
  };

  const handleClose = () => {
    console.log("❌ AddTransactionButton: Fermeture sans ajout");
    setShowModal(false);
  };

  return (
    <>
      {/* Bouton flottant */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          console.log("➕ Ouverture du modal d'ajout");
          setShowModal(true);
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={showModal}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={handleClose}
      >
        <AddTransaction
          volet={volet}
          onTransactionAdded={handleTransactionAdded}
          onClose={handleClose}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#14B8A6",
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "300",
  },
});