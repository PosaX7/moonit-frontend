import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import NTMHome from "./NTMHome";
import BudgetScreen from "./BudgetScreen";
import DashboardScreen from "./DashboardScreen";
import { Text } from "react-native";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: "#fff", height: 60 },
          tabBarLabelStyle: { fontSize: 14, marginBottom: 5 },
        }}
      >
        <Tab.Screen name="Suivi" component={NTMHome} />
        <Tab.Screen name="Budget" component={BudgetScreen} />
        <Tab.Screen name="Dashboard" component={DashboardScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
