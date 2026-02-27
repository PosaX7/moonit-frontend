// CategorieTransactionBudget.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import type { Transaction, Libelle } from "../services/api";

type Props = {
  transaction: Transaction;
  onBack: () => void;
};

const CategorieTransactionBudget: React.FC<Props> = ({ transaction, onBack }) => {
  const catData = transaction.categorie || transaction.categorie_detail;
  let catName = "Transaction";
  let icone = transaction.position === "depense" ? "💸" : "💰";
  let couleurCategorie = transaction.position === "depense" ? "#EF4444" : "#10B981";

  if (catData && typeof catData !== "string") {
    catName = catData.nom || catName;
    icone = catData.icone || icone;
    couleurCategorie = catData.couleur || couleurCategorie;
  } else if (typeof catData === "string") {
    catName = catData;
  }

  const formatDateDisplay = (dateString: string): string => {
    const datePart = dateString.split("T")[0];
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year.slice(2)}`;
  };

  const getDateIndicator = (dateString: string): { icon: string; color: string; label: string } => {
    const datePart = dateString.split("T")[0];
    const selectedDate = new Date(datePart);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate.getTime() === today.getTime()) {
      return { icon: "📅", color: "#3B82F6", label: "Aujourd'hui" };
    } else if (selectedDate < today) {
      return { icon: "✓", color: "#64748B", label: "Passée" };
    } else {
      return { icon: "⏰", color: "#F59E0B", label: "À venir" };
    }
  };

  const renderLibelle = ({ item }: { item: Libelle }) => {
    const dateInfo = getDateIndicator(item.date);

    return (
      <View style={styles.libelleCard}>
        <View style={styles.libelleHeader}>
          <Text style={styles.libelleName}>{item.nom}</Text>
        </View>
        <View style={styles.libelleRow}>
          <View style={styles.dateContainer}>
            <Text style={[styles.dateIndicator, { color: dateInfo.color }]}>{dateInfo.icon}</Text>
            <Text style={styles.dateText}>{formatDateDisplay(item.date)} • {dateInfo.label}</Text>
          </View>
          <Text style={[styles.libelleMontant, { color: couleurCategorie }]}>
            {Number(item.montant).toFixed(0)}
          </Text>
        </View>
        {item.commentaire ? (
          <Text style={styles.commentaire} numberOfLines={3}>
            {"💬 " + item.commentaire}
          </Text>
        ) : null}
      </View>
    );
  };

  const libelles = transaction.libelles ?? [];

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: couleurCategorie }]}>
        <TouchableOpacity onPress={onBack} style={styles.btnBack}>
          <Text style={styles.btnBackText}>{"←"}</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerIcon}>{icone}</Text>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{catName}</Text>
            <Text style={styles.headerSubtitle}>
              {libelles.length + " libellé" + (libelles.length > 1 ? "s" : "")}
            </Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Montant total</Text>
        <Text style={[styles.totalMontant, { color: couleurCategorie }]}>
          {(transaction.position === "depense" ? "- " : "+ ") + Number(transaction.montant_total).toFixed(0)}
        </Text>
      </View>

      <FlatList
        data={libelles}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderLibelle}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>{"📭"}</Text>
            <Text style={styles.emptyText}>Aucun libellé</Text>
          </View>
        }
      />
    </View>
  );
};

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
    paddingBottom: 20,
  },
  btnBack: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  btnBackText: {
    fontSize: 28,
    color: "#fff",
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  totalContainer: {
    backgroundColor: "#fff",
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  totalMontant: {
    fontSize: 24,
    fontWeight: "800",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  libelleCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  libelleHeader: {
    marginBottom: 8,
  },
  libelleName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  libelleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  dateIndicator: {
    fontSize: 14,
    marginRight: 6,
  },
  dateText: {
    fontSize: 13,
    color: "#64748B",
  },
  libelleMontant: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  commentaire: {
    fontSize: 13,
    color: "#64748B",
    fontStyle: "italic",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
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
  },
});

export default CategorieTransactionBudget;
