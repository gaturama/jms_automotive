import React, { useEffect, useState } from "react";
import { Car } from "../navigation/car";
import { useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { carService } from "../service/car.service";
import {
  ActivityIndicator,
  TouchableOpacity,
  Image,
  View,
  Text,
} from "react-native";
import { getCarImages } from "../data/carImages";
import { HapticFeedback } from "../utils/Haptics";
import { Ionicons } from "@expo/vector-icons";

const CAR_OF_THE_DAY_KEY = "@CarShowroom:carOfTheDay";

interface CarOfTheDayProps {
  onPress: (car: Car) => void;
}

export const CarOfTheDay: React.FC<CarOfTheDayProps> = ({ onPress }) => {
  const { colors } = useTheme();
  const [car, setCar] = useState<Car | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCarOfTheDay();
  }, []);

  const loadCarOfTheDay = async () => {
    try {
      const saved = await AsyncStorage.getItem(CAR_OF_THE_DAY_KEY);
      if (saved) {
        const { car: savedCar, date } = JSON.parse(saved);
        const today = new Date().toDateString();
        if (date === today) {
          setCar(savedCar);
          setIsLoading(false);
          return;
        }
      }

      const result = await carService.getCars({ limit: 100 });
      const cars: Car[] = result.cars;
      if (cars.length === 0) return;

      const randomIndex = Math.floor(Math.random() * cars.length);
      const randomCar = cars[randomIndex];

      await AsyncStorage.setItem(
        CAR_OF_THE_DAY_KEY,
        JSON.stringify({
          car: randomCar,
          date: new Date().toDateString(),
        }),
      );

      setCar(randomCar);
    } catch (error) {
      console.error("Erro ao carregar carro do dia:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          height: 200,
          marginHorizontal: 16,
          marginBottom: 20,
          borderRadius: 20,
          backgroundColor: colors.surface,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 1,
          borderColor: colors.glassBorder,
        }}
      >
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (!car) return null;

  const images = getCarImages(car.name);
  const thumbnail = images.length > 0 ? images[0] : null;

  return (
    <TouchableOpacity
      style={{
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
      onPress={() => {
        HapticFeedback.light();
        onPress(car);
      }}
      activeOpacity={0.9}
    >
      <View style={{ height: 200, backgroundColor: colors.surface }}>
        {thumbnail ? (
          <Image
            source={{ uri: thumbnail }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
        ) : (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: colors.inputBackground,
            }}
          >
            <Ionicons name="car-sport" size={60} color={colors.textTertiary} />
          </View>
        )}

        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "60%",
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "flex-end",
            padding: 16,
          }}
        >
          <View
            style={{
              position: "absolute",
              top: -100,
              left: 16,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.accent,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              gap: 6,
            }}
          >
            <Ionicons name="trophy" size={14} color="#fff" />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "800",
                color: "#fff",
                letterSpacing: 0.5,
              }}
            >
              CARRO DO DIA
            </Text>
          </View>

          <Text
            style={{
              fontSize: 22,
              fontWeight: "800",
              color: "#fff",
              marginBottom: 4,
            }}
          >
            {car.name}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="flash" size={14} color={colors.accentLight} />
              <Text style={{ fontSize: 13, color: "#fff", fontWeight: "600" }}>
                {car.horsepower} cv
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons
                name="speedometer"
                size={14}
                color={colors.accentLight}
              />
              <Text style={{ fontSize: 13, color: "#fff", fontWeight: "600" }}>
                {car.maxSpeed} km/h
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="cash" size={14} color={colors.accentLight} />
              <Text style={{ fontSize: 13, color: "#fff", fontWeight: "600" }}>
                R$ {(car.price / 1000000).toFixed(1)}M
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
