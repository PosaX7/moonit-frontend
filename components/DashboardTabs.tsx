import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type Props = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function DashboardTabs({ activeTab, setActiveTab }: Props) {
  return (
    <View style={styles.container}>
      <TabButton
        title="Budget & Suivi"
        tab="budgetsuivi"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <TabButton
        title="Budget"
        tab="budget"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <TabButton
        title="Suivi"
        tab="suivi"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </View>
  );
}

function TabButton({
  title,
  tab,
  activeTab,
  setActiveTab,
}: {
  title: string;
  tab: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const isActive = activeTab === tab;

  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={() => setActiveTab(tab)}
    >
      <Text style={[styles.title, isActive && styles.activeTitle]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#f3f3f3",
    paddingVertical: 8,
    justifyContent: "space-around",
    elevation: 2,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  title: {
    fontSize: 14,
    color: "#333",
  },
  activeTitle: {
    color: "#fff",
    fontWeight: "bold",
  },
});
