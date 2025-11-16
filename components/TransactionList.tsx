import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Transaction } from "../services/api";

const formatDateFR = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

type Props = {
  transactions: Transaction[];
  onDelete?: (transactionId: string, montantTotal: number) => void;
  onFilterChange?: (filteredTransactions: Transaction[]) => void;
};

const TransactionList: React.FC<Props> = ({
  transactions,
  onDelete,
  onFilterChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showActionBubble, setShowActionBubble] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const filteredTransactions = selectedCategory
    ? sortedTransactions.filter((t) => {
        const catData = t.categorie || t.categorie_detail;
        const name = typeof catData === "string" ? catData : catData?.nom;
        return name === selectedCategory;
      })
    : sortedTransactions;

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange(filteredTransactions);
    }
  }, [selectedCategory, transactions]);

  const handleIconPress = (item: Transaction) => {
    setSelectedTransaction(item);
    setShowActionBubble(true);

    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeBubble = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setShowActionBubble(false);
      setSelectedTransaction(null);
    });
  };

  const handleCategoryPress = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName);
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const catData = item.categorie || item.categorie_detail;
    let catName = "Transaction";
    let icone = item.position === "depense" ? "💸" : "💰";
    let couleurCategorie = item.position === "depense" ? "#EF4444" : "#10B981";

    if (catData) {
      if (typeof catData === "string") {
        catName = catData;
      } else {
        catName = catData.nom || catName;
        icone = catData.icone || icone;
        couleurCategorie = catData.couleur || couleurCategorie;
      }
    }

    const dateTransaction = item.created_at;
    const montantTotal = item.libelles
      ? item.libelles.reduce((acc, l) => acc + (l.montant || 0), 0)
      : item.montant_total || 0;

    const couleurMontant = item.position === "depense" ? "#EF4444" : "#10B981";
    const isSelected = selectedCategory === catName;

    return (
      <View style={[styles.card, isSelected && styles.cardSelected]}>
        {/* Icône - cliquable pour supprimer */}
        <TouchableOpacity
          style={[styles.iconContainer, { backgroundColor: couleurCategorie + "20" }]}
          onPress={() => handleIconPress(item)}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{icone}</Text>
        </TouchableOpacity>

        {/* Catégorie et Date */}
        <View style={styles.details}>
          <TouchableOpacity onPress={() => handleCategoryPress(catName)} activeOpacity={0.7}>
            <Text style={styles.categorie}>{catName}</Text>
          </TouchableOpacity>
          <Text style={styles.date}>{formatDateFR(dateTransaction)}</Text>
        </View>

        {/* Montant */}
        <Text style={[styles.montant, { color: couleurMontant }]}>
          {montantTotal.toLocaleString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {selectedCategory && (
        <TouchableOpacity
          style={styles.filterBadge}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={styles.filterText}>
            🔍 Filtre: {selectedCategory} ({filteredTransactions.length})
          </Text>
          <Text style={styles.filterIcon}>✕</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>Aucune transaction</Text>
            <Text style={styles.emptySubtext}>
              Appuyez sur le bouton + pour commencer
            </Text>
          </View>
        }
      />

      {/* Bulle d'action */}
      {showActionBubble && selectedTransaction && (
        <Animated.View
          style={[
            styles.actionBubbleContainer,
            { opacity: fadeAnim },
          ]}
        >
          <TouchableOpacity 
            style={styles.backdrop}
            activeOpacity={1}
            onPress={closeBubble}
          >
            <View style={styles.actionBubble}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  const montantTotal = selectedTransaction.libelles
                    ? selectedTransaction.libelles.reduce((acc, l) => acc + (l.montant || 0), 0)
                    : selectedTransaction.montant_total || 0;

                  onDelete?.(selectedTransaction.id, montantTotal);
                  closeBubble();
                }}
              >
                <Text style={styles.actionDelete}>Supprimer</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={closeBubble}>
                <Text style={styles.actionCancel}>Annuler</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  filterBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#14B8A6",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    padding: 12,
    borderRadius: 8,
  },
  filterText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  filterIcon: { color: "#fff", fontSize: 18, marginLeft: 8 },

  listContainer: { padding: 16, paddingBottom: 100 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },

  cardSelected: {
    borderWidth: 2,
    borderColor: "#14B8A6",
    backgroundColor: "#F0FDFA",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  icon: { fontSize: 24 },

  details: {
    flex: 1,
  },

  categorie: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 4,
  },

  date: {
    fontSize: 13,
    color: "#000000",
  },

  montant: {
    fontSize: 18,
    fontWeight: "700",
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94A3B8",
    textAlign: "center",
    paddingHorizontal: 32,
  },

  actionBubbleContainer: {
    position: "absolute",
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  actionBubble: {
    backgroundColor: "#fff",
    paddingVertical: 22,
    paddingHorizontal: 30,
    borderRadius: 16,
    width: "72%",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },

  actionButton: { paddingVertical: 12 },

  actionDelete: {
    fontSize: 17,
    fontWeight: "700",
    color: "#EF4444",
    textAlign: "center",
  },

  actionCancel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
    marginTop: 10,
  },
});

export default TransactionList;
