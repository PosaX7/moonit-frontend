import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
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
};

const TransactionList: React.FC<Props> = ({ transactions }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Tri par date décroissante
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Filtrage par catégorie
  const filteredTransactions = selectedCategory
    ? sortedTransactions.filter((t) => {
        const categorieData = t.categorie || t.categorie_detail;
        const categorieId = typeof categorieData === "string" ? categorieData : categorieData?.id;
        return categorieId === selectedCategory;
      })
    : sortedTransactions;

  const handleCategoryPress = (categoryId: string) => {
    // Si on clique sur la catégorie déjà sélectionnée, on désélectionne
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    // Catégorie (depuis categorie ou categorie_detail selon la réponse API)
    const categorieData = item.categorie || item.categorie_detail;
    let categorie = "Transaction";
    let categorieId = "";
    let icone = item.position === "depense" ? "💸" : "💰";
    let couleurCategorie = item.position === "depense" ? "#EF4444" : "#10B981";

    if (categorieData) {
      if (typeof categorieData === "string") {
        categorie = categorieData || categorie;
        categorieId = categorieData;
      } else {
        categorie = categorieData.nom || categorie;
        categorieId = categorieData.id || "";
        icone = categorieData.icone || icone;
        couleurCategorie = categorieData.couleur || couleurCategorie;
      }
    }

    // Date
    const dateTransaction = item.created_at;
    
    // Montant (sans devise)
    const montantValue = item.montant_total?.toLocaleString() || 0;
    const montant = montantValue;
    const couleurMontant = item.position === "depense" ? "#EF4444" : "#10B981";

    const isSelected = selectedCategory === categorieId;

    return (
      <View style={[styles.card, isSelected && styles.cardSelected]}>
        {/* Icône de catégorie - cliquable */}
        <TouchableOpacity
          style={[styles.iconContainer, { backgroundColor: couleurCategorie + "20" }]}
          onPress={() => handleCategoryPress(categorieId)}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{icone}</Text>
        </TouchableOpacity>
        
        {/* Détails */}
        <View style={styles.details}>
          <Text style={styles.categorie}>{categorie}</Text>
          <Text style={styles.date}>{formatDateFR(dateTransaction)}</Text>
        </View>
        
        {/* Montant */}
        <Text style={[styles.montant, { color: couleurMontant }]}>
          {montant}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Indicateur de filtre actif */}
      {selectedCategory && (
        <TouchableOpacity
          style={styles.filterBadge}
          onPress={() => setSelectedCategory(null)}
        >
          <Text style={styles.filterText}>Filtre actif - Appuyez pour tout afficher</Text>
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
            <Text style={styles.emptyIcon}>
              {selectedCategory ? "🔍" : "📭"}
            </Text>
            <Text style={styles.emptyText}>
              {selectedCategory
                ? "Aucune transaction pour cette catégorie"
                : "Aucune transaction"}
            </Text>
            <Text style={styles.emptySubtext}>
              {selectedCategory
                ? "Appuyez sur le filtre pour afficher toutes les transactions"
                : "Appuyez sur le bouton + pour commencer"}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  filterIcon: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
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
  icon: {
    fontSize: 24,
  },
  details: {
    flex: 1,
  },
  categorie: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  date: {
    fontSize: 13,
    color: "#94A3B8",
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
});

export default TransactionList;