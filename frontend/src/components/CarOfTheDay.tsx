import React, { useEffect, useState } from "react";
import { Car } from "../navigation/car";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { carService } from "../service/car.service";
import { Image, View, Text, Pressable } from "react-native";
import { getCarImages } from "../data/carImages";
import { HapticFeedback } from "../utils/Haptics";
import { Ionicons } from "@expo/vector-icons";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { createStyles } from "../styles/stylesCarCard";

const CAR_OF_THE_DAY_KEY = "@CarShowroom:carOfTheDay";

interface CarOfTheDayProps {
  onPress: (car: Car) => void;
}

export const CarOfTheDay: React.FC<CarOfTheDayProps> = ({ onPress }) => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    loadCarOfTheDay();
  }, []);

  const loadCarOfTheDay = async () => {
    try {
      const saved = await AsyncStorage.getItem(CAR_OF_THE_DAY_KEY);
      if (saved) {
        const { car: savedCar, date } = JSON.parse(saved);
        if (date === new Date().toDateString()) {
          setCar(savedCar);
          return;
        }
      }

      const result = await carService.getCars({ limit: 100 });
      const cars: Car[] = result.cars;
      if (cars.length === 0) return;

      const randomCar = cars[Math.floor(Math.random() * cars.length)];
      await AsyncStorage.setItem(CAR_OF_THE_DAY_KEY, JSON.stringify({
        car: randomCar,
        date: new Date().toDateString(),
      }));
      setCar(randomCar);
    } catch (error) {
      console.error("Erro ao carregar carro do dia:", error);
    }
  };

  if (!car) return null;

  const images = getCarImages(car.name);
  const thumbnail = images.length > 0 ? images[0] : null;

  return (
    <Pressable
      style={styles.card}
      onPress={() => { HapticFeedback.light(); onPress(car); }}
      android_ripple={{ color: '#333' }}
    >
      <View style={{
        position: "absolute",
        top: 12, left: 12,
        zIndex: 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.accent,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 5,
      }}>
        <Ionicons name="trophy" size={12} color="#fff" />
        <Text style={{ fontSize: 11, fontWeight: "800", color: "#fff", letterSpacing: 0.5 }}>
          CARRO DO DIA
        </Text>
      </View>

      <View style={{ height: 180, backgroundColor: colors.surface, borderRadius: 16, overflow: "hidden" }}>
        {thumbnail ? (
          <Image
            source={thumbnail}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: colors.inputBackground }}>
            <Ionicons name="car-sport" size={48} color={colors.textTertiary} />
            <Text style={{ color: colors.textTertiary, fontSize: 12, marginTop: 8, fontWeight: "600" }}>
              {car.brand}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{car.name}</Text>
        <View style={styles.specs}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Motor</Text>
            <Text style={styles.specValue}>{car.engine}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>0-100 km/h</Text>
            <Text style={styles.specValue}>{car.acceleration}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Vel. Máxima</Text>
            <Text style={styles.specValue}>{car.maxSpeed} km/h</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};