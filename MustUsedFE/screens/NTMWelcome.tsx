import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  NTMWelcome: undefined;
  NTMHome: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "NTMWelcome">;

export default function NTMWelcome() {
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("NTMHome"); // après 1,5s on va sur MoonitHome
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bienvenue dans NoTiMo 🚀</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  welcome: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
