// src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { loginUser } from "../services/api";

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginUser(username, password);
      if (res.access) {
        Alert.alert("Bienvenue !", "Connexion réussie");
        navigation.replace("NTMHome"); // redirige vers la page principale
      } else {
        Alert.alert("Erreur", "Identifiants incorrects");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erreur", "Connexion échouée. Vérifie tes identifiants.");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        Connexion
      </Text>

      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 15 }}
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 25 }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        style={{ backgroundColor: "#28a745", padding: 15, borderRadius: 8 }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
          Se connecter
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={{ textAlign: "center", marginTop: 15 }}>
          Pas encore de compte ? S’inscrire
        </Text>
      </TouchableOpacity>
    </View>
  );
}
