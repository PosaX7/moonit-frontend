import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { loginUser } from "../services/api";
import { showMessage } from "react-native-flash-message"; // 👈 import

export default function LoginScreen({ navigation }: any) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://moonit-backend-10.onrender.com/healthcheck/")
      .then(() => console.log("Backend réveillé ✅"))
      .catch(() => console.log("Serveur en veille..."));
  }, []);

  const handleLogin = async () => {
    if (!username || !password) {
      showMessage({
        message: "Champs manquants ⚠️",
        description: "Remplis tous les champs.",
        type: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await loginUser(username, password);

      if (res.access) {
        showMessage({
          message: "Bienvenue 👋",
          description: "Connexion réussie !",
          type: "success",
          icon: "success",
        });
        navigation.replace("NTMWelcome");
      } else {
        showMessage({
          message: "Erreur ❌",
          description: "Identifiants incorrects.",
          type: "danger",
        });
      }
    } catch (error) {
      showMessage({
        message: "Connexion échouée ❌",
        description: "Vérifie tes identifiants.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
      }}
    >
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#222" }}>
        Connexion
      </Text>

      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 15,
        }}
      />
      <TextInput
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginBottom: 25,
        }}
      />

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: loading ? "#6c757d" : "#28a745",
          padding: 15,
          borderRadius: 8,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {loading ? (
          <>
            <ActivityIndicator color="#fff" />
            <Text style={{ color: "white", marginLeft: 10 }}>Connexion...</Text>
          </>
        ) : (
          <Text style={{ color: "white", fontWeight: "bold" }}>Se connecter</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text
          style={{
            textAlign: "center",
            marginTop: 15,
            color: "#007bff",
          }}
        >
          Pas encore de compte ? S’inscrire
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
