import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface TurbineRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: number;
  readonly?: boolean;
  showHalf?: boolean;
}

export const TurbineRating: React.FC<TurbineRatingProps> = ({
  rating,
  onRatingChange,
  size = 28,
  readonly = false,
  showHalf = true,
}) => {
  const { colors } = useTheme();

  const handlePress = (turbineNumber: number) => {
    if (readonly || !onRatingChange) return;
    onRatingChange(turbineNumber);
  };

  const renderTurbine = (turbineNumber: number) => {
    const filled = rating >= turbineNumber;
    const halfFilled = showHalf && rating >= turbineNumber - 0.5 && rating < turbineNumber;

    return (
      <TouchableOpacity
        key={turbineNumber}
        onPress={() => handlePress(turbineNumber)}
        disabled={readonly}
        style={styles.turbineButton}
        activeOpacity={0.7}
      >
        <Ionicons
          name={filled ? "speedometer" : halfFilled ? "speedometer-outline" : "speedometer-outline"}
          size={size}
          color={filled || halfFilled ? "#0F766E" : colors.textTertiary}
          style={filled && styles.turbineFilled}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map(renderTurbine)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  turbineButton: {
    padding: 4,
  },

  turbineFilled: {
    shadowColor: "#0F766E",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
  },
});