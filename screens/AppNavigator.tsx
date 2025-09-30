import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import NTMHome from "./NTMHome";
import BudgetScreen from "./BudgetScreen";
import DashboardScreen from "./DashboardScreen";
import { LayoutDashboard, ListChecks, Wallet } from "lucide-react-native";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: { backgroundColor: "#fff", height: 60 },
          tabBarLabelStyle: { fontSize: 12 },
          tabBarShowLabel: true,
          tabBarActiveTintColor: "#2563eb", // bleu actif
          tabBarInactiveTintColor: "gray", // gris inactif
          tabBarIcon: ({ color }) => {
            if (route.name === "Suivi") {
              return <Wallet color={color} size={24} />;
            } else if (route.name === "Budget") {
              return <ListChecks color={color} size={24} />;
            } else if (route.name === "Dashboard") {
              return <LayoutDashboard color={color} size={24} />;
            }
          },
        })}
      >
        <Tab.Screen name="Suivi" component={NTMHome} />
        <Tab.Screen name="Budget" component={BudgetScreen} />
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
