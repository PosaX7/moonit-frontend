// Bottom.tsx
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
        tabBarInactiveTintColor: "#9ca3af",
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
            <View style={[
              styles.iconContainer,
              focused && styles.iconContainerActive
            ]}>
              <IconComponent 
                color={color} 
                size={focused ? 26 : 24}
                strokeWidth={focused ? 2.5 : 2}
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
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    paddingBottom: 10,
    paddingTop: 10,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginTop: 4,
    letterSpacing: 0.3,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 4,
  },
  iconContainerActive: {
    transform: [{ scale: 1.1 }],
  },
});