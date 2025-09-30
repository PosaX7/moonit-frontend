import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../App"; // adapte le chemin si nécessaire

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation sequence: fade-in puis fade-out
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800, // fade-in
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 700, // fade-out
        useNativeDriver: true,
      }),
    ]).start();

    // Naviguer après 1,5s
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: "NTMHome" }],
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
        Bienvenue sur NoTiMo 🎉
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 22, fontWeight: "bold" },
});

export default WelcomeScreen;
