import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { deleteTransaction } from "./api";

// 🔄 Fonction principale : synchronisation des suppressions
export async function syncDeletedTransactions() {
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      console.log("⏸️ Pas de connexion — synchro en attente.");
      return;
    }

    const deleted = await AsyncStorage.getItem("deletedTransactions");
    if (!deleted) return;

    const ids: number[] = JSON.parse(deleted);
    if (ids.length === 0) return;

    console.log("🔁 Synchronisation des suppressions :", ids);

    for (const id of ids) {
      try {
        await deleteTransaction(id);
        console.log(`✅ Transaction ${id} supprimée du backend.`);
      } catch (err) {
        console.warn(`⚠️ Erreur suppression transaction ${id}:`, err);
      }
    }

    // Nettoyage après synchro réussie
    await AsyncStorage.removeItem("deletedTransactions");
    console.log("🧹 Suppressions synchronisées et nettoyées.");

  } catch (err) {
    console.error("Erreur dans syncDeletedTransactions:", err);
  }
}
