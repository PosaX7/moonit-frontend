import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Écrans
import RegisterScreen from "./screens/RegisterScreen";
import NTMWelcome from "./screens/NTMWelcome";
import NTMHome from "./screens/NTMHome";
import BudgetScreen from "./screens/BudgetScreen";
import DashboardScreen from "./screens/DashboardScreen";

// Icônes
import { LayoutDashboard, ListChecks, Wallet } from "lucide-react-native";

// Types du Stack
export type RootStackParamList = {
  Register: undefined;
  NTMWelcome: undefined;
  NTMHome: undefined; // correspond à AppNavigator
};

// Création du Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// Création du Bottom Tab Navigator
const Tab = createBottomTabNavigator();

// Bottom Tabs pour NTMHome
function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#fff", height: 60 },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
        tabBarActiveTintColor: "#2563eb", // bleu actif
        tabBarInactiveTintColor: "gray", // gris inactif
        tabBarShowLabel: true,
        tabBarIcon: ({ color }) => {
          if (route.name === "Suivi") return <Wallet color={color} size={24} />;
          if (route.name === "Budget") return <ListChecks color={color} size={24} />;
          if (route.name === "Dashboard") return <LayoutDashboard color={color} size={24} />;
          return null;
        },
      })}
    >
      <Tab.Screen
        name="Suivi"
        component={NTMHome}
        options={{ tabBarLabel: "Suivi" }}
      />
      <Tab.Screen
        name="Budget"
        component={BudgetScreen}
        options={{ tabBarLabel: "Budget" }}
      />
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ tabBarLabel: "Dashboard" }}
      />
    </Tab.Navigator>
  );
}

// App principale
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NTMWelcome"
          component={NTMWelcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NTMHome"
          component={AppNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
