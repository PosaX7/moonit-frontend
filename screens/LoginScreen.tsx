import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SvgXml } from "react-native-svg";
import { loginUser } from "../services/api";
import { showMessage } from "react-native-flash-message";

const compassSvg = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Dégradés dorés brillants -->
    <linearGradient id="goldRim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffed4e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ffd700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#c4941f;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="goldInner" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#c4941f;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ffd700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#c4941f;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="needleGold" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffed4e;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#ffd700;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#d4af37;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b8941f;stop-opacity:1" />
    </linearGradient>
    
    <linearGradient id="needleRed" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#dc2626;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#991b1b;stop-opacity:1" />
    </linearGradient>
    
    <radialGradient id="compassFace">
      <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#16213e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f1419;stop-opacity:1" />
    </radialGradient>
    
    <radialGradient id="centerGem">
      <stop offset="0%" style="stop-color:#ffed4e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ffd700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d4af37;stop-opacity:1" />
    </radialGradient>
    
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    
    <filter id="shadow">
      <feDropShadow dx="4" dy="4" stdDeviation="6" flood-opacity="0.4"/>
    </filter>
  </defs>
  
  <rect width="400" height="400" fill="none"/>
  
  <!-- Boussole centrée -->
  <g transform="translate(200, 200)" filter="url(#shadow)">
    
    <!-- Ombre portée -->
    <ellipse cx="0" cy="8" rx="95" ry="90" fill="#000000" opacity="0.2"/>
    
    <!-- Anneau extérieur doré -->
    <circle cx="0" cy="0" r="100" fill="url(#goldRim)" stroke="#ffed4e" stroke-width="2"/>
    
    <!-- Anneau rainuré -->
    <circle cx="0" cy="0" r="88" fill="none" stroke="url(#goldInner)" stroke-width="8"/>
    <circle cx="0" cy="0" r="84" fill="none" stroke="#c4941f" stroke-width="1.5"/>
    <circle cx="0" cy="0" r="92" fill="none" stroke="#c4941f" stroke-width="1.5"/>
    
    <!-- Face de la boussole -->
    <circle cx="0" cy="0" r="80" fill="url(#compassFace)"/>
    
    <!-- $ en haut uniquement -->
    <g filter="url(#glow)">
      <text x="0" y="-48" font-family="Arial, sans-serif" font-size="36" font-weight="bold" text-anchor="middle" fill="url(#goldInner)">$</text>
    </g>
    
    <!-- Aiguille pointant vers $ (rotation de 35°) -->
    <g transform="rotate(35)">
      <!-- Partie rouge (arrière) -->
      <path d="M 0,0 L -8,-15 L 0,-58 L 8,-15 Z" fill="url(#needleRed)" stroke="#991b1b" stroke-width="1"/>
      
      <!-- Partie dorée (avant) pointant vers $-->
      <path d="M 0,0 L -10,12 L 0,62 L 10,12 Z" fill="url(#needleGold)" stroke="#d4af37" stroke-width="1.5" filter="url(#glow)"/>
      
      <!-- Reflets sur l'aiguille dorée -->
      <path d="M 0,10 L -5,15 L 0,58 L 5,15 Z" fill="#ffed4e" opacity="0.4"/>
    </g>
    
    <!-- Centre de la boussole - gemme dorée -->
    <circle cx="0" cy="0" r="16" fill="url(#centerGem)" stroke="#ffed4e" stroke-width="2" filter="url(#glow)"/>
    <circle cx="0" cy="0" r="12" fill="url(#goldRim)" opacity="0.8"/>
    
    <!-- Reflet central -->
    <ellipse cx="-4" cy="-4" rx="6" ry="8" fill="#ffed4e" opacity="0.6"/>
  </g>
</svg>
`;

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
    <SafeAreaView style={styles.container}>
      {/* Logo en arrière-plan */}
      <View style={styles.backgroundLogo}>
        <SvgXml xml={compassSvg} width="280" height="280" opacity={0.08} />
      </View>

      <View style={styles.content}>
        {/* Logo principal */}
        <View style={styles.logoContainer}>
          <SvgXml xml={compassSvg} width="120" height="120" />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.subtitle}>Ravi de te revoir ! 👋</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nom d'utilisateur</Text>
            <TextInput
              placeholder="Ton identifiant"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              style={styles.input}
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mot de passe</Text>
            <TextInput
              placeholder="••••••••"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              style={styles.input}
              placeholderTextColor="#9ca3af"
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            style={[
              styles.loginButton,
              loading && styles.loginButtonDisabled,
            ]}
          >
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#fff" size="small" />
                <Text style={styles.loginButtonText}>Connexion...</Text>
              </View>
            ) : (
              <Text style={styles.loginButtonText}>Se connecter</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Pas encore de compte ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.linkText}>S'inscrire</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  backgroundLogo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -140 }, { translateY: -140 }],
    zIndex: 0,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  header: {
    marginBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6b7280",
    fontWeight: "500",
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#111827",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  loginButton: {
    backgroundColor: "#10b981",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loginButtonDisabled: {
    backgroundColor: "#9ca3af",
    shadowColor: "#9ca3af",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 24,
  },
  footerText: {
    fontSize: 15,
    color: "#6b7280",
    fontWeight: "500",
  },
  linkText: {
    fontSize: 15,
    color: "#10b981",
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});