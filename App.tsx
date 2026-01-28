import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FlashMessage from "react-native-flash-message";

// Screens
import RegisterScreen from "./screens/RegisterScreen";
import LoginScreen from "./screens/LoginScreen";
import NTMWelcome from "./screens/NTMWelcome";
import BottomTabs from "./components/Bottom";

// Types du Stack
export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  NTMWelcome: undefined;
  NTMHome: undefined;
  AddBudget: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

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

          {/* Accès principal après connexion - Bottom Tabs */}
          <Stack.Screen
            name="NTMHome"
            component={BottomTabs}
            options={{ headerShown: false }}
          />

          {/* AddBudget screen inside the navigator */}
        </Stack.Navigator>
      </NavigationContainer>

      {/* ✅ FlashMessage global */}
      <FlashMessage position="top" />
    </>
  );
}