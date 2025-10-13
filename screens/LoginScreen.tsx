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

const magnifyingGlassSvg = `
<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffed4e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ffd700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#c4941f;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#c4941f;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ffd700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#c4941f;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="handleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffed4e;stop-opacity:1" />
      <stop offset="30%" style="stop-color:#ffd700;stop-opacity:1" />
      <stop offset="70%" style="stop-color:#d4af37;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#b8941f;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="dollarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffed4e;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#ffd700;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#d4af37;stop-opacity:1" />
    </linearGradient>
    <radialGradient id="innerGrad">
      <stop offset="0%" style="stop-color:#b8941f;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#8b6914;stop-opacity:1" />
    </radialGradient>
    <filter id="shadow">
      <feDropShadow dx="3" dy="3" stdDeviation="4" flood-opacity="0.4"/>
    </filter>
    <filter id="dollarShadow">
      <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.5"/>
    </filter>
  </defs>
  
  <rect width="400" height="400" fill="none"/>
  
  <g transform="translate(200, 200)" filter="url(#shadow)">
    <ellipse cx="0" cy="5" rx="85" ry="80" fill="#000000" opacity="0.1"/>
    <circle cx="0" cy="0" r="85" fill="url(#goldGrad1)"/>
    <circle cx="0" cy="0" r="72" fill="url(#innerGrad)"/>
    <circle cx="0" cy="0" r="66" fill="none" stroke="url(#goldGrad2)" stroke-width="4"/>
    <circle cx="0" cy="0" r="62" fill="#ffffff" opacity="0.15"/>
    <ellipse cx="-18" cy="-18" rx="25" ry="30" fill="#ffffff" opacity="0.5"/>
    <ellipse cx="20" cy="20" rx="12" ry="15" fill="#ffffff" opacity="0.2"/>
    
    <g filter="url(#dollarShadow)">
      <text x="3" y="30" font-family="Arial, Helvetica, sans-serif" font-size="90" font-weight="bold" text-anchor="middle" fill="#8b6914" opacity="0.5">$</text>
      <text x="0" y="28" font-family="Arial, Helvetica, sans-serif" font-size="90" font-weight="bold" text-anchor="middle" fill="url(#dollarGrad)">$</text>
      <text x="-3" y="25" font-family="Arial, Helvetica, sans-serif" font-size="90" font-weight="bold" text-anchor="middle" fill="#ffed4e" opacity="0.3">$</text>
    </g>
    
    <g transform="rotate(45)">
      <rect x="64" y="-12" width="65" height="24" rx="12" fill="#000000" opacity="0.15"/>
      <rect x="60" y="-13" width="65" height="26" rx="13" fill="url(#handleGrad)"/>
      <rect x="68" y="-11" width="2.5" height="22" fill="#b8941f" opacity="0.6"/>
      <rect x="78" y="-11" width="2.5" height="22" fill="#b8941f" opacity="0.6"/>
      <rect x="88" y="-11" width="2.5" height="22" fill="#b8941f" opacity="0.6"/>
      <rect x="98" y="-11" width="2.5" height="22" fill="#b8941f" opacity="0.6"/>
      <rect x="108" y="-11" width="2.5" height="22" fill="#b8941f" opacity="0.6"/>
      <circle cx="118" cy="0" r="13" fill="url(#goldGrad1)"/>
      <circle cx="118" cy="0" r="9" fill="url(#innerGrad)"/>
    </g>
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
        <SvgXml xml={magnifyingGlassSvg} width="280" height="280" opacity={0.08} />
      </View>

      <View style={styles.content}>
        {/* Logo principal */}
        <View style={styles.logoContainer}>
          <SvgXml xml={magnifyingGlassSvg} width="120" height="120" />
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Connexion</Text>
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