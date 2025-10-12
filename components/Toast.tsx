// components/Toast.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface Props {
  message: string;
  type: "success" | "error";
  visible: boolean;
  onHide: () => void;
}

const Toast: React.FC<Props> = ({ message, type, visible, onHide }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animation d'apparition
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(2500), // Reste visible 2.5 secondes
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide(); // Cache le toast après l'animation
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        type === "success" ? styles.success : styles.error,
        { opacity },
      ]}
    >
      <Text style={styles.icon}>
        {type === "success" ? "✓" : "✕"}
      </Text>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: "50%",
    transform: [{ translateX: -150 }],
    width: 300,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 9999,
  },
  success: {
    backgroundColor: "#10b981",
  },
  error: {
    backgroundColor: "#ef4444",
  },
  icon: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold",
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 16,
    color: "#fff",
    fontWeight: "600",
  },
});

export default Toast;