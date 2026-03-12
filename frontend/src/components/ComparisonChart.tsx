import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import { Car } from "../navigation/car";
import { useTheme } from "../context/ThemeContext";

interface ComparisonChartProps {
  car1: Car;
  car2: Car;
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({ car1, car2 }) => {
  const { colors } = useTheme();

  const normalizeValue = (value: number, max: number) => {
    return (value / max) * 100;
  };

  const maxHP = Math.max(car1.horsepower, car2.horsepower);
  const maxSpeed = Math.max(car1.maxSpeed, car2.maxSpeed);
  const maxPrice = Math.max(car1.price, car2.price);

  const car1HPPercent = normalizeValue(car1.horsepower, maxHP);
  const car2HPPercent = normalizeValue(car2.horsepower, maxHP);
  const car1SpeedPercent = normalizeValue(car1.maxSpeed, maxSpeed);
  const car2SpeedPercent = normalizeValue(car2.maxSpeed, maxSpeed);
  const car1PricePercent = normalizeValue(car1.price, maxPrice);
  const car2PricePercent = normalizeValue(car2.price, maxPrice);

  const renderBarChart = (
    label: string,
    icon: string,
    car1Value: number,
    car2Value: number,
    car1Percent: number,
    car2Percent: number,
    unit: string
  ) => {
    const car1Anim = useRef(new Animated.Value(0)).current;
    const car2Anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(car1Anim, {
          toValue: car1Percent,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(car2Anim, {
          toValue: car2Percent,
          duration: 1000,
          useNativeDriver: false,
        }),
      ]).start();
    }, [car1Percent, car2Percent]);

    const car1Width = car1Anim.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });

    const car2Width = car2Anim.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });

    return (
      <View style={styles(colors).chartItem}>
        <Text style={styles(colors).chartLabel}>{label}</Text>
        
        <View style={styles(colors).barContainer}>
          <View style={styles(colors).barBackground}>
            <Animated.View
              style={[
                styles(colors).bar,
                {
                  width: car1Width,
                  backgroundColor: '#4CAF50',
                },
              ]}
            />
          </View>
          <Text style={styles(colors).barValue}>
            {car1Value}{unit}
          </Text>
        </View>

        <View style={styles(colors).barContainer}>
          <View style={styles(colors).barBackground}>
            <Animated.View
              style={[
                styles(colors).bar,
                {
                  width: car2Width,
                  backgroundColor: '#2196F3',
                },
              ]}
            />
          </View>
          <Text style={styles(colors).barValue}>
            {car2Value}{unit}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).legend}>
        <View style={styles(colors).legendItem}>
          <View style={[styles(colors).legendDot, { backgroundColor: '#4CAF50' }]} />
          <Text style={styles(colors).legendText}>{car1.brand}</Text>
        </View>
        <View style={styles(colors).legendItem}>
          <View style={[styles(colors).legendDot, { backgroundColor: '#2196F3' }]} />
          <Text style={styles(colors).legendText}>{car2.brand}</Text>
        </View>
      </View>

      {renderBarChart(
        "Potência",
        "flash",
        car1.horsepower,
        car2.horsepower,
        car1HPPercent,
        car2HPPercent,
        " cv"
      )}

      {renderBarChart(
        "Velocidade Máxima",
        "speedometer",
        car1.maxSpeed,
        car2.maxSpeed,
        car1SpeedPercent,
        car2SpeedPercent,
        " km/h"
      )}

      {renderBarChart(
        "Preço",
        "cash",
        parseFloat((car1.price / 1000000).toFixed(1)),
        parseFloat((car2.price / 1000000).toFixed(1)),
        car1PricePercent,
        car2PricePercent,
        "M"
      )}
    </View>
  );
};

const styles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.glassBackground,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },

  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    marginBottom: 24,
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  legendText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },

  chartItem: {
    marginBottom: 24,
  },

  chartLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 12,
  },

  barContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },

  barBackground: {
    flex: 1,
    height: 32,
    backgroundColor: colors.inputBackground,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },

  bar: {
    height: "100%",
    borderRadius: 8,
  },

  barValue: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
    minWidth: 80,
    textAlign: "right",
  },
});