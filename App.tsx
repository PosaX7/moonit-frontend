import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FlashMessage from "react-native-flash-message";

// Screens
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import NTMWelcome from "./screens/NTMWelcome";
import NTMHome from "./screens/NTMHome";
import BudgetScreen from "./screens/BudgetScreen";
import DashboardScreen from "./screens/DashboardScreen";
import HistoriqueLibelle from "./screens/HistoriqueLibelle";
import HistoriqueCategorie from "./screens/HistoriqueCategorie";

// Icônes
import { LayoutDashboard, ListChecks, Wallet } from "lucide-react-native";

// Types du Stack
export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  NTMWelcome: undefined;
  NTMHome: undefined; // correspond au TabNavigator
  HistoriqueLibelle: { libelle: string };
  HistoriqueCategorie: { categorie: string };
};

// Navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// --- Bottom Tabs : Navigation principale après connexion ---
function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: "#fff", height: 60 },
        tabBarLabelStyle: { fontSize: 12, marginBottom: 5 },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: true,
        tabBarIcon: ({ color }) => {
          switch (route.name) {
            case "Suivi":
              return <Wallet color={color} size={24} />;
            case "Budget":
              return <ListChecks color={color} size={24} />;
            case "Dashboard":
              return <LayoutDashboard color={color} size={24} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Suivi" component={NTMHome} options={{ tabBarLabel: "Suivi" }} />
      <Tab.Screen name="Budget" component={BudgetScreen} options={{ tabBarLabel: "Budget" }} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: "Dashboard" }} />
    </Tab.Navigator>
  );
}

// --- App principale ---
export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {/* Auth Screens */}
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />

          {/* Écran de bienvenue (optionnel) */}
          <Stack.Screen
            name="NTMWelcome"
            component={NTMWelcome}
            options={{ headerShown: false }}
          />

          {/* Accès principal après connexion */}
          <Stack.Screen
            name="NTMHome"
            component={AppTabs}
            options={{ headerShown: false }}
          />

          {/* 🔹 Nouveaux écrans pour l’historique */}
          <Stack.Screen
            name="HistoriqueLibelle"
            component={HistoriqueLibelle}
            options={{ title: "Historique par Libellé" }}
          />
          <Stack.Screen
            name="HistoriqueCategorie"
            component={HistoriqueCategorie}
            options={{ title: "Historique par Catégorie" }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {/* ✅ FlashMessage global */}
      <FlashMessage position="top" />
    </>
  );
}
