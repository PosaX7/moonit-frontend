import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { registerUser } from "../services/api";
import { showMessage } from "react-native-flash-message"; // 👈 import

export default function RegisterScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await registerUser(username, email, password);
      showMessage({
        message: "Compte créé avec succès 🎉",
        description: "Tu peux maintenant te connecter.",
        type: "success", // ✅ vert
        icon: "success",
        duration: 3000,
      });
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      showMessage({
        message: "Erreur d'inscription ❌",
        description: "Vérifie tes informations.",
        type: "danger", // ❌ rouge
        icon: "danger",
      });
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20 }}>
        Inscription
      </Text>

      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 15 }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
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
        onPress={handleRegister}
        style={{ backgroundColor: "#007bff", padding: 15, borderRadius: 8 }}
      >
        <Text style={{ color: "white", textAlign: "center", fontWeight: "bold" }}>
          S'inscrire
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={{ textAlign: "center", marginTop: 15 }}>
          Déjà un compte ? Se connecter
        </Text>
      </TouchableOpacity>
    </View>
  );
}
