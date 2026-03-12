import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Modal,
  FlatList,
  RefreshControl,
} from "react-native";
import {
  Skeleton,
  SkeletonListItem,
  SkeletonChart,
} from "../components/SkeletonComponents";
import { Car } from "../navigation/car";
import { MOCK_CARS } from "../data/carsData";
import { Ionicons } from "@expo/vector-icons";
import { HapticFeedback } from "../utils/Haptics";
import { useTheme } from "../context/ThemeContext";
import { createStyles } from "../styles/stylesCompare";
import { RootStackParamList } from "../navigation/types";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { ComparisonChart } from "../components/ComparisonChart";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "Compare">;

export default function CompareScreen({ navigation }: Props) {
  const [car1, setCar1] = useState<Car | null>(null);
  const [car2, setCar2] = useState<Car | null>(null);
  const [selectingCar, setSelectingCar] = useState<1 | 2 | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    if (car1 && car2) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
    }

    setRefreshing(false);
  };

  const handleSelectCar = (carNumber: 1 | 2) => {
    setSelectingCar(carNumber);
    setModalVisible(true);
  };

  const handleCarSelected = async (car: Car) => {
    setModalVisible(false);
    setIsLoading(true);

    HapticFeedback.success();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (selectingCar === 1) {
      setCar1(car);
    } else if (selectingCar === 2) {
      setCar2(car);
    }

    setIsLoading(false);
    setSelectingCar(null);
  };

  const handleSwapCars = () => {
    HapticFeedback.medium();
    const temp = car1;
    setCar1(car2);
    setCar2(temp);
  };

  const handleReset = () => {
    HapticFeedback.warning();
    setCar1(null);
    setCar2(null);
  };

  const renderCarSelector = (carNumber: 1 | 2, selectedCar: Car | null) => {
    return (
      <TouchableOpacity
        style={styles.carSelector}
        onPress={() => handleSelectCar(carNumber)}
        activeOpacity={0.8}
      >
        {selectedCar ? (
          <View style={styles.selectedCarContainer}>
            <Text style={styles.selectedCarName}>{selectedCar.name}</Text>
            <Text style={styles.selectedCarModel}>
              {selectedCar.brand} {selectedCar.year}
            </Text>
            <View style={styles.quickStats}>
              <View style={styles.quickStat}>
                <Ionicons name="flash" size={16} color={colors.accent} />
                <Text style={styles.quickStatValue}>
                  {selectedCar.horsepower} cv
                </Text>
              </View>
              <View style={styles.quickStat}>
                <Ionicons name="speedometer" size={16} color={colors.accent} />
                <Text style={styles.quickStatValue}>
                  {selectedCar.maxSpeed} km/h
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCarContainer}>
            <Ionicons
              name="add-circle-outline"
              size={48}
              color={colors.textTertiary}
            />
            <Text style={styles.emptyCarText}>
              Selecionar Carro {carNumber}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderComparisonRow = (
    label: string,
    icon: string,
    value1: string | number,
    value2: string | number,
    highlight?: boolean,
  ) => {
    const isValue1Better =
      typeof value1 === "number" && typeof value2 === "number"
        ? value1 > value2
        : false;
    const isValue2Better =
      typeof value1 === "number" && typeof value2 === "number"
        ? value2 > value1
        : false;

    return (
      <View style={styles.comparisonRow}>
        <View
          style={[
            styles.comparisonCell,
            isValue1Better && highlight && styles.winnerCell,
          ]}
        >
          <Text
            style={[
              styles.comparisonValue,
              isValue1Better && highlight && styles.winnerText,
            ]}
          >
            {value1}
          </Text>
        </View>

        <View style={styles.comparisonLabel}>
          <Ionicons name={icon as any} size={20} color={colors.accent} />
          <Text style={styles.comparisonLabelText}>{label}</Text>
        </View>

        <View
          style={[
            styles.comparisonCell,
            isValue2Better && highlight && styles.winnerCell,
          ]}
        >
          <Text
            style={[
              styles.comparisonValue,
              isValue2Better && highlight && styles.winnerText,
            ]}
          >
            {value2}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.accent}
      />

      <View style={styles.backgroundParticles}>
        <Animated.View style={[styles.particle, styles.particle1]} />
        <Animated.View style={[styles.particle, styles.particle2]} />
      </View>

      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Ionicons
            name="git-compare"
            size={24}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.headerTitle}>Comparar Carros</Text>
        </View>

        <TouchableOpacity onPress={handleReset} style={styles.headerButton}>
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.accent]}
            tintColor={colors.accent}
            progressBackgroundColor={colors.surface}
          />
        }
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View style={styles.selectorsContainer}>
            {renderCarSelector(1, car1)}

            {car1 && car2 && (
              <TouchableOpacity
                style={styles.swapButton}
                onPress={handleSwapCars}
              >
                <Ionicons
                  name="swap-horizontal"
                  size={24}
                  color={colors.accent}
                />
              </TouchableOpacity>
            )}

            {renderCarSelector(2, car2)}
          </View>

          {car1 && car2 ? (
            isLoading ? (
              <>
                <View style={styles.chartsSection}>
                  <Skeleton
                    width={180}
                    height={24}
                    borderRadius={6}
                    style={{ marginBottom: 16 }}
                  />
                  <SkeletonChart />
                </View>

                <View style={styles.specsSection}>
                  <Skeleton
                    width={160}
                    height={24}
                    borderRadius={6}
                    style={{ marginBottom: 16 }}
                  />

                  <View style={styles.comparisonTable}>
                    <Skeleton
                      width={120}
                      height={20}
                      borderRadius={4}
                      style={{ marginBottom: 12 }}
                    />
                    <SkeletonListItem />
                    <SkeletonListItem />
                    <SkeletonListItem />
                    <SkeletonListItem />

                    <Skeleton
                      width={80}
                      height={20}
                      borderRadius={4}
                      style={{ marginTop: 20, marginBottom: 12 }}
                    />
                    <SkeletonListItem />
                    <SkeletonListItem />
                    <SkeletonListItem />

                    <Skeleton
                      width={100}
                      height={20}
                      borderRadius={4}
                      style={{ marginTop: 20, marginBottom: 12 }}
                    />
                    <SkeletonListItem />
                    <SkeletonListItem />
                    <SkeletonListItem />
                    <SkeletonListItem />
                  </View>
                </View>

                <View style={styles.summarySection}>
                  <Skeleton
                    width={100}
                    height={24}
                    borderRadius={6}
                    style={{ marginBottom: 16 }}
                  />
                  <View style={styles.summaryCard}>
                    {[1, 2, 3, 4].map((i) => (
                      <View key={i} style={styles.summaryRow}>
                        <Skeleton width={120} height={16} borderRadius={4} />
                        <Skeleton width={150} height={16} borderRadius={4} />
                      </View>
                    ))}
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.chartsSection}>
                  <Text style={styles.sectionTitle}>Comparação Gráfica</Text>
                  <ComparisonChart car1={car1} car2={car2} />
                </View>

                <View style={styles.specsSection}>
                  <Text style={styles.sectionTitle}>Especificações</Text>

                  <View style={styles.comparisonTable}>
                    <Text style={styles.categoryTitle}>Desempenho</Text>
                    {renderComparisonRow(
                      "Potência",
                      "flash",
                      `${car1.horsepower} cv`,
                      `${car2.horsepower} cv`,
                      true,
                    )}
                    {renderComparisonRow(
                      "Vel. Máxima",
                      "speedometer",
                      `${car1.maxSpeed} km/h`,
                      `${car2.maxSpeed} km/h`,
                      true,
                    )}
                    {renderComparisonRow(
                      "0-100 km/h",
                      "timer",
                      car1.acceleration,
                      car2.acceleration,
                      true,
                    )}
                    {renderComparisonRow(
                      "Torque",
                      "git-merge",
                      car1.torque,
                      car2.torque,
                    )}

                    <Text style={styles.categoryTitle}>Geral</Text>
                    {renderComparisonRow(
                      "Preço",
                      "cash",
                      `R$ ${(car1.price / 1000000).toFixed(1)}M`,
                      `R$ ${(car2.price / 1000000).toFixed(1)}M`,
                    )}
                    {renderComparisonRow(
                      "Ano",
                      "calendar",
                      car1.year,
                      car2.year,
                    )}
                    {renderComparisonRow(
                      "Peso",
                      "scale",
                      `${car1.weight} kg`,
                      `${car2.weight} kg`,
                    )}

                    <Text style={styles.categoryTitle}>Motor</Text>
                    {renderComparisonRow(
                      "Motor",
                      "build",
                      car1.engine,
                      car2.engine,
                    )}
                    {renderComparisonRow(
                      "Transmissão",
                      "settings",
                      car1.transmission,
                      car2.transmission,
                    )}
                    {renderComparisonRow(
                      "Tração",
                      "swap-horizontal",
                      car1.drivetrain,
                      car2.drivetrain,
                    )}
                    {renderComparisonRow(
                      "Combustível",
                      "water",
                      car1.fuelType,
                      car2.fuelType,
                    )}
                  </View>
                </View>

                <View style={styles.summarySection}>
                  <Text style={styles.sectionTitle}>Resumo</Text>
                  <View style={styles.summaryCard}>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Mais Potente:</Text>
                      <Text style={styles.summaryValue}>
                        {car1.horsepower > car2.horsepower
                          ? car1.name
                          : car2.name}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Mais Rápido:</Text>
                      <Text style={styles.summaryValue}>
                        {car1.maxSpeed > car2.maxSpeed ? car1.name : car2.name}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Mais Caro:</Text>
                      <Text style={styles.summaryValue}>
                        {car1.price > car2.price ? car1.name : car2.name}
                      </Text>
                    </View>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Mais Leve:</Text>
                      <Text style={styles.summaryValue}>
                        {car1.weight < car2.weight ? car1.name : car2.name}
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            )
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name="git-compare-outline"
                size={80}
                color={colors.textTertiary}
              />
              <Text style={styles.emptyTitle}>Selecione 2 Carros</Text>
              <Text style={styles.emptyText}>
                Escolha dois carros para comparar suas especificações e
                desempenho
              </Text>
            </View>
          )}
        </Animated.View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Selecionar Carro {selectingCar}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={28} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={MOCK_CARS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalCarItem}
                  onPress={() => handleCarSelected(item)}
                  activeOpacity={0.7}
                >
                  <View>
                    <Text style={styles.modalCarName}>{item.name}</Text>
                    <Text style={styles.modalCarBrand}>
                      {item.brand} • {item.year}
                    </Text>
                  </View>
                  <View style={styles.modalCarStats}>
                    <Text style={styles.modalCarStat}>
                      {item.horsepower} cv
                    </Text>
                    <Text style={styles.modalCarStat}>
                      {item.maxSpeed} km/h
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}