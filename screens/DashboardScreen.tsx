import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import DashboardTabs from "../components/DashboardTabs";
import DashboardBudgetSuiviScreen from "../screens/DashboardBudgetSuiviScreen";
import DashboardBudgetScreen from "../screens/DashboardBudgetScreen";
import DashboardSuiviScreen from "../screens/DashboardSuiviScreen";

export default function DashboardScreen() {
  const [activeTab, setActiveTab] = useState("budgetsuivi");

  const renderContent = () => {
    switch (activeTab) {
      case "budget":
        return <DashboardBudgetScreen />;
      case "suivi":
        return <DashboardSuiviScreen />;
      default:
        return <DashboardBudgetSuiviScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, paddingHorizontal: 10 }
});
