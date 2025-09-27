import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Écrans
import RegisterScreen from "./screens/RegisterScreen";
import NTMWelcome from "./screens/NTMWelcome";
import NTMHome from "./screens/NTMHome";
import BudgetScreen from "./screens/BudgetScreen";
import DashboardScreen from "./screens/DashboardScreen";

// Types du Stack
type RootStackParamList = {
  Register: undefined;
  NTMWelcome: undefined;
  NTMHome: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Bottom Tabs pour NTMHome
function AppNavigator() {
  return (
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
          component={AppNavigator} // <-- Bottom Tabs
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
