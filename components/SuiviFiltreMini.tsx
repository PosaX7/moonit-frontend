import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Modal } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type Props = {
  activeFilter: "today" | "month" | "year" | "period";
  onChange: (filter: "today" | "month" | "year" | "period") => void;
  transactions?: { created_at: string }[];
  onMonthSelect?: (month: string) => void;
  onPeriodSelect?: (dates: string[]) => void;
};

const SuiviFiltreMini: React.FC<Props> = ({
  activeFilter,
  onChange,
  transactions = [],
  onMonthSelect,
  onPeriodSelect,
}) => {
  const [showMonthList, setShowMonthList] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);

  // Liste unique des mois
  const months = Array.from(
    new Set(
      transactions.map((t) => {
        const d = new Date(t.created_at);
        return `${d.getFullYear()}-${d.getMonth() + 1}`;
      })
    )
  ).sort((a, b) => (a > b ? -1 : 1));

  const toggleMonthList = () => setShowMonthList(!showMonthList);

  const handleMonthSelect = (month: string) => {
    onMonthSelect?.(month);
    setShowMonthList(false);
  };

  const handlePeriodSelect = (date: Date) => {
    const iso = date.toISOString().split("T")[0];
    setSelectedDates((prev) => {
      const newSelection = prev.includes(iso)
        ? prev.filter((d) => d !== iso)
        : [...prev, iso];
      onPeriodSelect?.(newSelection);
      return newSelection;
    });
  };

  return (
    <View style={styles.container}>
      {["year", "today", "month", "period"].map((f) => (
        <TouchableOpacity
          key={f}
          style={[styles.btn, activeFilter === f && styles.activeBtn]}
          onPress={() => {
            onChange(f as any);
            if (f === "month") toggleMonthList();
            if (f === "period") setShowCalendar(true);
          }}
        >
          <Text style={[styles.txt, activeFilter === f && styles.activeTxt]}>
            {f === "year" ? "Année" : f === "today" ? "Aujourd'hui" : f === "month" ? "Mois" : "Période"}
          </Text>
        </TouchableOpacity>
      ))}

      {/* Liste des mois */}
      {showMonthList && (
        <View style={styles.dropdown}>
          <FlatList
            data={months}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleMonthSelect(item)}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Calendrier multi-sélection */}
      <DateTimePickerModal
        isVisible={showCalendar}
        mode="date"
        onConfirm={(date) => handlePeriodSelect(date)}
        onCancel={() => setShowCalendar(false)}
        minimumDate={new Date(2000, 0, 1)}
        maximumDate={new Date()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-between" },
  btn: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#CBD5E1", borderRadius: 4 },
  activeBtn: { backgroundColor: "#F97316" },
  txt: { fontWeight: "700", color: "#1E293B" },
  activeTxt: { color: "#fff" },
  dropdown: { position: "absolute", top: 40, backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", zIndex: 100 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#eee" },
});

export default SuiviFiltreMini;
