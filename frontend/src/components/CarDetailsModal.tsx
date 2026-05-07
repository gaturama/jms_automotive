import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useTheme } from "../context/ThemeContext";
import { Car } from "../navigation/car";
import { HapticFeedback } from "../utils/Haptics";
import { getCarDetailedDescription } from "../data/carDetailsDescriptions";

interface CarDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  car: Car;
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function CarDetailsModal({
  visible,
  onClose,
  car,
}: CarDetailsModalProps) {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    if (visible) {
      console.log("car.name:", car.name);
      console.log("detalhes:", getCarDetailedDescription(car.name));
      HapticFeedback.light();
      setIsContentReady(false);

      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      setTimeout(() => {
        setIsContentReady(true);
      }, 100);
    } else {
      setIsContentReady(false);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    HapticFeedback.light();
    onClose();
  };

  const carDetails =
    visible && isContentReady ? getCarDetailedDescription(car.name) : null;

  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
        <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleClose}
          />
        </BlurView>
      </Animated.View>

      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>

        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Sobre o Veículo</Text>
            <Text style={styles.headerSubtitle}>{car.name}</Text>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClose}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          removeClippedSubviews={true}
        >
          {!isContentReady ? (
            <View style={{ paddingVertical: 40, alignItems: "center" }}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text
                style={{
                  color: colors.textSecondary,
                  marginTop: 16,
                  fontSize: 14,
                }}
              >
                Carregando informações...
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Ionicons
                    name="speedometer"
                    size={20}
                    color={colors.accent}
                  />
                  <Text style={styles.statValue}>{car.horsepower}</Text>
                  <Text style={styles.statLabel}>CV</Text>
                </View>

                <View style={styles.statBox}>
                  <Ionicons name="flash" size={20} color={colors.accent} />
                  <Text style={styles.statValue}>{car.maxSpeed}</Text>
                  <Text style={styles.statLabel}>km/h</Text>
                </View>

                <View style={styles.statBox}>
                  <Ionicons name="rocket" size={20} color={colors.accent} />
                  <Text style={styles.statValue}>{car.acceleration}</Text>
                  <Text style={styles.statLabel}>0-100</Text>
                </View>

                <View style={styles.statBox}>
                  <Ionicons name="calendar" size={20} color={colors.accent} />
                  <Text style={styles.statValue}>{car.year}</Text>
                  <Text style={styles.statLabel}>Ano</Text>
                </View>
              </View>

              <View style={styles.descriptionContainer}>
                {carDetails ? (
                  <>
                    {carDetails.fullDescription && (
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>
                          {carDetails.fullDescription}
                        </Text>
                      </View>
                    )}

                    {carDetails.history && (
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>
                          História e Legado
                        </Text>
                        <Text style={styles.descriptionText}>
                          {carDetails.history}
                        </Text>
                      </View>
                    )}

                    {carDetails.technology && (
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>
                          Tecnologia e Inovação
                        </Text>
                        <Text style={styles.descriptionText}>
                          {carDetails.technology}
                        </Text>
                      </View>
                    )}

                    {carDetails.performance && (
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>
                          Performance e Dinâmica
                        </Text>
                        <Text style={styles.descriptionText}>
                          {carDetails.performance}
                        </Text>
                      </View>
                    )}

                    {carDetails.design && (
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>
                          Design e Aerodinâmica
                        </Text>
                        <Text style={styles.descriptionText}>
                          {carDetails.design}
                        </Text>
                      </View>
                    )}

                    {carDetails.luxury && (
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.sectionTitle}>
                          Luxo e Acabamento
                        </Text>
                        <Text style={styles.descriptionText}>
                          {carDetails.luxury}
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>
                      {car.description || "Descrição não disponível."}
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ height: 40 }} />
            </>
          )}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: SCREEN_HEIGHT * 0.85,
      backgroundColor: colors.background,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 20,
    },
    handleContainer: {
      alignItems: "center",
      paddingVertical: 12,
    },
    handle: {
      width: 40,
      height: 4,
      backgroundColor: colors.textTertiary,
      borderRadius: 2,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      flex: 1,
    },
    contentContainer: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    statBox: {
      flex: 1,
      alignItems: "center",
      backgroundColor: colors.surface,
      paddingVertical: 16,
      borderRadius: 12,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    statValue: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginTop: 8,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 11,
      color: colors.textSecondary,
      textTransform: "uppercase",
    },
    descriptionContainer: {
      marginBottom: 24,
    },
    descriptionText: {
      fontSize: 15,
      lineHeight: 24,
      color: colors.textSecondary,
      textAlign: "justify",
    },
    specsSection: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 16,
    },
    specRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    specLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    specValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
    },
  });
