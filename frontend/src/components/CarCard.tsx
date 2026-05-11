import React, { useRef } from "react";
import {
  View,
  Text,
  Pressable,
  Image,
  Animated,
  PanResponder,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Car } from "../navigation/car";
import { useTheme } from "../context/ThemeContext";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { createStyles } from "../styles/stylesCarCard";
import { getCarImages } from "../data/carImages";
import { useFavorites } from "./Favorites";
import { HapticFeedback } from "../utils/Haptics";

interface CarCardProps {
  car: Car;
  onPress?: () => void;
}

const SWIPE_THRESHOLD = 80;

export const CarCard: React.FC<CarCardProps> = ({ car, onPress }) => {
  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();
  const { isFavorite, toggleFavorite } = useFavorites();

  const images = getCarImages(car.name);
  const thumbnail = images.length > 0 ? images[0] : null;
  const favorite = isFavorite(car._id);

  const translateX = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 20;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx > 0) {
          translateX.setValue(gestureState.dx);
          const progress = Math.min(gestureState.dx / SWIPE_THRESHOLD, 1);
          heartScale.setValue(progress);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= SWIPE_THRESHOLD) {
          HapticFeedback.favorite();
          toggleFavorite(car);

          Animated.sequence([
            Animated.spring(translateX, {
              toValue: 120,
              useNativeDriver: true,
              tension: 40,
              friction: 6,
            }),
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 40,
              friction: 8,
            }),
          ]).start();

          Animated.sequence([
            Animated.spring(heartScale, {
              toValue: 1.3,
              useNativeDriver: true,
            }),
            Animated.spring(heartScale, {
              toValue: 0,
              useNativeDriver: true,
            }),
          ]).start();
        } else {
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 40,
              friction: 8,
            }),
            Animated.spring(heartScale, {
              toValue: 0,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  const heartOpacity = heartScale.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0.5, 1],
  });

  const backgroundOpacity = translateX.interpolate({
    inputRange: [0, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  return (
    <View style={{ position: "relative", marginBottom: 12 }}>
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: favorite ? "#FF6B6B15" : "#4CAF5015",
          borderRadius: 16,
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 24,
          opacity: backgroundOpacity,
        }}
      >
        <Animated.View
          style={{ transform: [{ scale: heartScale }], opacity: heartOpacity }}
        >
          <Ionicons
            name={favorite ? "heart-dislike" : "heart"}
            size={36}
            color={favorite ? "#FF6B6B" : "#4CAF50"}
          />
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={{ transform: [{ translateX }] }}
        {...panResponder.panHandlers}
      >
        <Pressable
          style={styles.card}
          onPress={onPress}
          android_ripple={{ color: "#333" }}
        >
          <View
            style={{
              height: 180,
              backgroundColor: colors.surface,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {thumbnail ? (
              <Image
                source={thumbnail}
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
                <Ionicons
                  name="car-sport"
                  size={48}
                  color={colors.textTertiary}
                />
                <Text
                  style={{
                    color: colors.textTertiary,
                    fontSize: 12,
                    marginTop: 8,
                    fontWeight: "600",
                  }}
                >
                  {car.brand}
                </Text>
              </View>
            )}

            {favorite && (
              <View
                style={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                  backgroundColor: "rgba(0,0,0,0.6)",
                  borderRadius: 20,
                  padding: 6,
                }}
              >
                <Ionicons name="heart" size={16} color="#FF6B6B" />
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
      </Animated.View>
    </View>
  );
};
