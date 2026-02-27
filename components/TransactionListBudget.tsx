// TransactionListBudget.tsx
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
import { Calendar } from "react-native-calendars";

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
  onDelete?: (transactionId: string) => void;
  onFilterChange?: (filteredTransactions: Transaction[]) => void;
  onCategoryPress?: (transaction: Transaction) => void;
};

const TransactionListBudget: React.FC<Props> = ({ transactions, onDelete, onFilterChange, onCategoryPress }) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [periodFilter, setPeriodFilter] = useState<"today" | "month" | "year" | "period">("today");
  const [selectedMonth, setSelectedMonth] = useState<{ year: number; month: number; label: string } | null>(null);
  const [selectedDates, setSelectedDates] = useState<Record<string, boolean>>({});
  const [showActionBubble, setShowActionBubble] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const getMonthsWithTransactions = () => {
    const monthsMap: Record<string, { year: number; month: number; label: string }> = {};
    transactions.forEach((tx) => {
      const date = new Date(tx.created_at);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      if (!monthsMap[key]) {
        const monthName = date.toLocaleString("fr-FR", { month: "long" });
        monthsMap[key] = { label: `${monthName} ${date.getFullYear()}`, year: date.getFullYear(), month: date.getMonth() };
      }
    });
    return Object.values(monthsMap);
  };

  const filteredTransactions = sortedTransactions.filter((t) => {
    const catData = t.categorie || t.categorie_detail;
    const catName = typeof catData === "string" ? catData : catData?.nom;
    const categoryMatch = selectedCategory ? catName === selectedCategory : true;

    const txDate = new Date(t.created_at);
    let periodMatch = true;
    const now = new Date();

    if (periodFilter === "today") {
      periodMatch = txDate.toDateString() === now.toDateString();
    } else if (periodFilter === "month" && selectedMonth) {
      periodMatch = txDate.getMonth() === selectedMonth.month && txDate.getFullYear() === selectedMonth.year;
    } else if (periodFilter === "year") {
      periodMatch = txDate.getFullYear() === now.getFullYear();
    } else if (periodFilter === "period") {
      if (Object.keys(selectedDates).length === 0) return true;
      const txDateStr = txDate.toISOString().split("T")[0];
      periodMatch = selectedDates[txDateStr] === true;
    }

    return categoryMatch && periodMatch;
  });

  useEffect(() => {
    onFilterChange?.(filteredTransactions);
  }, [selectedCategory, periodFilter, selectedMonth, selectedDates, transactions]);

  const handleCategoryPress = (item: Transaction) => {
    if (onCategoryPress) {
      onCategoryPress(item);
    } else {
      // Fallback: ouvrir la bulle d'action
      setSelectedTransaction(item);
      setShowActionBubble(true);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
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

  const toggleDate = (date: string) => {
    setSelectedDates((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const renderItem = ({ item }: { item: Transaction }) => {
    const catData = item.categorie || item.categorie_detail;
    let catName = "Transaction";
    let icone = item.position === "depense" ? "💸" : "💰";
    let couleurCategorie = item.position === "depense" ? "#EF4444" : "#10B981";

    if (catData && typeof catData !== "string") {
      catName = catData.nom || catName;
      icone = catData.icone || icone;
      couleurCategorie = catData.couleur || couleurCategorie;
    } else if (typeof catData === "string") {
      catName = catData;
    }

    const montant = item.montant_total?.toLocaleString() || "0";
    const couleurMontant = item.position === "depense" ? "#EF4444" : "#10B981";

    return (
      <TouchableOpacity 
        style={[styles.card, { borderLeftColor: couleurCategorie }]}
        onPress={() => handleCategoryPress(item)}
        activeOpacity={0.7}
      >
        {/* Icône */}
        <Text style={styles.icone}>{icone}</Text>

        {/* Catégorie */}
        <View style={styles.info}>
          <Text style={styles.categorie}>{catName}</Text>
        </View>

        {/* Montant total */}
        <Text style={[styles.montant, { color: couleurMontant }]}>
          {montant}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Filtre période */}
      <View style={styles.periodFilterContainer}>
        {["today", "month", "year", "period"].map((key) => {
          const label = key === "today" ? "Aujourd'hui" : key === "month" ? "Mois" : key === "year" ? "Année" : "Période";
          const active = periodFilter === key;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.periodBtn, active && styles.periodBtnActive]}
              onPress={() => setPeriodFilter(key as any)}
            >
              <Text style={[styles.periodTxt, active && styles.periodTxtActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Mois dynamique */}
      {periodFilter === "month" && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 10, marginBottom: 8 }}>
          {getMonthsWithTransactions().map((m) => {
            const active = selectedMonth?.year === m.year && selectedMonth?.month === m.month;
            return (
              <TouchableOpacity
                key={`${m.year}-${m.month}`}
                style={[styles.periodBtn, active && styles.periodBtnActive]}
                onPress={() => setSelectedMonth(m)}
              >
                <Text style={[styles.periodTxt, active && styles.periodTxtActive]}>{m.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Calendrier multi-date */}
      {periodFilter === "period" && (
        <Calendar
          onDayPress={(day) => toggleDate(day.dateString)}
          markedDates={Object.fromEntries(
            Object.entries(selectedDates).map(([k, v]) => [k, { selected: v, selectedColor: "#F97316" }])
          )}
        />
      )}

      {/* Badge catégorie */}
      {selectedCategory && (
        <TouchableOpacity style={styles.filterBadge} onPress={() => setSelectedCategory(null)}>
          <Text style={styles.filterText}>🔍 Filtre: {selectedCategory} ({filteredTransactions.length})</Text>
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
            <Text style={styles.emptySubtext}>Appuyez sur le bouton + pour commencer</Text>
          </View>
        }
      />

      {/* Bulle d'action */}
      {showActionBubble && selectedTransaction && (
        <Animated.View style={[styles.actionBubbleContainer, { opacity: fadeAnim }]}>
          <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeBubble}>
            <View style={styles.actionBubble}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  onDelete?.(selectedTransaction.id);
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
  filterText: { color: "#fff", fontSize: 13, fontWeight: "600", flex: 1 },
  filterIcon: { color: "#fff", fontSize: 18, marginLeft: 8 },

  listContainer: { padding: 16, paddingBottom: 100 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  icone: {
    fontSize: 32,
    marginRight: 12,
  },

  info: {
    flex: 1,
  },

  categorie: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },

  montant: {
    fontSize: 18,
    fontWeight: "800",
  },

  emptyContainer: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#64748B", marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: "#94A3B8", textAlign: "center", paddingHorizontal: 32 },

  actionBubbleContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.35)", justifyContent: "center", alignItems: "center" },
  actionBubble: { backgroundColor: "#fff", paddingVertical: 22, paddingHorizontal: 30, borderRadius: 16, width: "72%", elevation: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 10 },
  actionButton: { paddingVertical: 12 },
  actionDelete: { fontSize: 17, fontWeight: "700", color: "#EF4444", textAlign: "center" },
  actionCancel: { fontSize: 16, fontWeight: "600", color: "#334155", textAlign: "center", marginTop: 10 },

  periodFilterContainer: { flexDirection: "row", paddingHorizontal: 10, paddingVertical: 8, justifyContent: "space-between", backgroundColor: "#F8FAFC", marginBottom: 8 },
  periodBtn: { paddingVertical: 8, paddingHorizontal: 14, backgroundColor: "#CBD5E1", borderRadius: 4, marginHorizontal: 4 },
  periodBtnActive: { backgroundColor: "#F97316" },
  periodTxt: { color: "#1E293B", fontWeight: "700", fontSize: 13 },
  periodTxtActive: { color: "#fff" },
});

export default TransactionListBudget;
