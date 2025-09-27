import React, { useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const WelcomeScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem("user");
      if (user) {
        // Si déjà connecté, redirection auto
        navigation.reset({
          index: 0,
          routes: [{ name: "NTMHome" }],
        });
      }
    };
    checkUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bienvenue sur NoTiMo 🎉</Text>
      <Button title="Entrer" onPress={() => navigation.navigate("NTMHome")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 22, marginBottom: 20 },
});

export default WelcomeScreen;
