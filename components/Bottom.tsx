import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, StyleSheet, Platform } from "react-native";
import { LayoutDashboard, ListChecks, Wallet } from "lucide-react-native";

// Screens
import NTMHome from "../screens/NTMHome";
import BudgetScreen from "../screens/BudgetScreen";
import DashboardScreen from "../screens/DashboardScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarActiveTintColor: "#10b981",
        tabBarInactiveTintColor: "#cbd5e1",
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, focused }) => {
          let IconComponent;

          switch (route.name) {
            case "Suivi":
              IconComponent = Wallet;
              break;
            case "Budget":
              IconComponent = ListChecks;
              break;
            case "Dashboard":
              IconComponent = LayoutDashboard;
              break;
            default:
              return null;
          }

          return (
            <View style={styles.iconContainer}>
              <IconComponent
                color={color}
                size={focused ? 24 : 22}
                strokeWidth={focused ? 2.2 : 1.8}
              />
            </View>
          );
        },
      })}
    >
      <Tab.Screen
        name="Suivi"
        component={NTMHome}
        options={{
          tabBarLabel: "Suivi",
        }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{
          tabBarLabel: "Budget",
        }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarLabel: "Dashboard",
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 8 : 4,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 4,
    letterSpacing: 0.2,
    color: "#1e293b",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
});