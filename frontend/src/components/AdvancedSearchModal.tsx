import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useTheme } from "../context/ThemeContext";
import { HapticFeedback } from "../utils/Haptics";

/**
 * Modal de Busca Avançada
 *
 * Filtros disponíveis:
 * - Faixa de potência (HP)
 * - Faixa de preço (slider duplo)
 * - Velocidade máxima
 * - Ano de fabricação (range)
 * - Múltiplas marcas (checkboxes)
 * - Tipo de combustível (multi-select)
 * - Transmissão (multi-select)
 */

export interface AdvancedFilters {
  priceRange: { min: number; max: number };
  horsepowerRange: { min: number; max: number };
  maxSpeedRange: { min: number; max: number };
  yearRange: { min: number; max: number };

  brands: string[];
  fuelTypes: string[];
  transmissions: string[];
  drivetrains: string[];
}

interface AdvancedSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: AdvancedFilters) => void;
  currentFilters: AdvancedFilters;
  availableBrands: string[];
}

export const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  visible,
  onClose,
  onApply,
  currentFilters,
  availableBrands,
}) => {
  const { colors } = useTheme();

  const [priceMin, setPriceMin] = useState(currentFilters.priceRange.min);
  const [priceMax, setPriceMax] = useState(currentFilters.priceRange.max);
  const [hpMin, setHpMin] = useState(currentFilters.horsepowerRange.min);
  const [hpMax, setHpMax] = useState(currentFilters.horsepowerRange.max);
  const [speedMin, setSpeedMin] = useState(currentFilters.maxSpeedRange.min);
  const [speedMax, setSpeedMax] = useState(currentFilters.maxSpeedRange.max);
  const [yearMin, setYearMin] = useState(currentFilters.yearRange.min);
  const [yearMax, setYearMax] = useState(currentFilters.yearRange.max);

  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    currentFilters.brands,
  );
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>(
    currentFilters.fuelTypes,
  );
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(
    currentFilters.transmissions,
  );
  const [selectedDrivetrains, setSelectedDrivetrains] = useState<string[]>(
    currentFilters.drivetrains,
  );

  const fuelTypeOptions = ["Gasolina", "Diesel", "Elétrico", "Híbrido", "Flex"];
  const transmissionOptions = [
    "Manual",
    "Automático",
    "Semi-automático",
    "CVT",
    "DCT",
  ];
  const drivetrainOptions = [
    "Tração Dianteira",
    "Tração Traseira",
    "Tração Integral",
    "AWD",
  ];

  const PRICE_MIN = 0;
  const PRICE_MAX = 50000000;
  const HP_MIN = 0;
  const HP_MAX = 1500;
  const SPEED_MIN = 0;
  const SPEED_MAX = 500;
  const YEAR_MIN = 1950;
  const YEAR_MAX = new Date().getFullYear() + 1;

  useEffect(() => {
    if (visible) {
      setPriceMin(currentFilters.priceRange.min);
      setPriceMax(currentFilters.priceRange.max);
      setHpMin(currentFilters.horsepowerRange.min);
      setHpMax(currentFilters.horsepowerRange.max);
      setSpeedMin(currentFilters.maxSpeedRange.min);
      setSpeedMax(currentFilters.maxSpeedRange.max);
      setYearMin(currentFilters.yearRange.min);
      setYearMax(currentFilters.yearRange.max);
      setSelectedBrands(currentFilters.brands);
      setSelectedFuelTypes(currentFilters.fuelTypes);
      setSelectedTransmissions(currentFilters.transmissions);
      setSelectedDrivetrains(currentFilters.drivetrains);
    }
  }, [visible, currentFilters]);

  const handleApply = () => {
    HapticFeedback.success();

    const filters: AdvancedFilters = {
      priceRange: { min: priceMin, max: priceMax },
      horsepowerRange: { min: hpMin, max: hpMax },
      maxSpeedRange: { min: speedMin, max: speedMax },
      yearRange: { min: yearMin, max: yearMax },
      brands: selectedBrands,
      fuelTypes: selectedFuelTypes,
      transmissions: selectedTransmissions,
      drivetrains: selectedDrivetrains,
    };

    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    HapticFeedback.warning();

    setPriceMin(PRICE_MIN);
    setPriceMax(PRICE_MAX);
    setHpMin(HP_MIN);
    setHpMax(HP_MAX);
    setSpeedMin(SPEED_MIN);
    setSpeedMax(SPEED_MAX);
    setYearMin(YEAR_MIN);
    setYearMax(YEAR_MAX);
    setSelectedBrands([]);
    setSelectedFuelTypes([]);
    setSelectedTransmissions([]);
    setSelectedDrivetrains([]);
  };

  const toggleBrand = (brand: string) => {
    HapticFeedback.selection();
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const toggleFuelType = (fuel: string) => {
    HapticFeedback.selection();
    setSelectedFuelTypes((prev) =>
      prev.includes(fuel) ? prev.filter((f) => f !== fuel) : [...prev, fuel],
    );
  };

  const toggleTransmission = (trans: string) => {
    HapticFeedback.selection();
    setSelectedTransmissions((prev) =>
      prev.includes(trans) ? prev.filter((t) => t !== trans) : [...prev, trans],
    );
  };

  const toggleDrivetrain = (drive: string) => {
    HapticFeedback.selection();
    setSelectedDrivetrains((prev) =>
      prev.includes(drive) ? prev.filter((d) => d !== drive) : [...prev, drive],
    );
  };

  const formatPrice = (value: number) => {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`;
    }
    return `R$ ${(value / 1000).toFixed(0)}K`;
  };

  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={28} color={colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Ionicons name="search" size={24} color={colors.accentLight} />
            <Text style={styles.headerTitle}>Busca Avançada</Text>
          </View>

          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetButtonText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preço</Text>

            <View style={styles.rangeValues}>
              <Text style={styles.rangeValue}>{formatPrice(priceMin)}</Text>
              <Text style={styles.rangeSeparator}>até</Text>
              <Text style={styles.rangeValue}>{formatPrice(priceMax)}</Text>
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Mínimo</Text>
              <Slider
                style={styles.slider}
                minimumValue={PRICE_MIN}
                maximumValue={PRICE_MAX}
                value={priceMin}
                onValueChange={setPriceMin}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.inputBackground}
                thumbTintColor={colors.accent}
                step={100000}
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Máximo</Text>
              <Slider
                style={styles.slider}
                minimumValue={PRICE_MIN}
                maximumValue={PRICE_MAX}
                value={priceMax}
                onValueChange={setPriceMax}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.inputBackground}
                thumbTintColor={colors.accent}
                step={100000}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚡ Potência</Text>

            <View style={styles.rangeValues}>
              <Text style={styles.rangeValue}>{hpMin} cv</Text>
              <Text style={styles.rangeSeparator}>até</Text>
              <Text style={styles.rangeValue}>{hpMax} cv</Text>
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Mínimo</Text>
              <Slider
                style={styles.slider}
                minimumValue={HP_MIN}
                maximumValue={HP_MAX}
                value={hpMin}
                onValueChange={setHpMin}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.inputBackground}
                thumbTintColor={colors.accent}
                step={10}
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Máximo</Text>
              <Slider
                style={styles.slider}
                minimumValue={HP_MIN}
                maximumValue={HP_MAX}
                value={hpMax}
                onValueChange={setHpMax}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.inputBackground}
                thumbTintColor={colors.accent}
                step={10}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Velocidade Máxima</Text>

            <View style={styles.rangeValues}>
              <Text style={styles.rangeValue}>{speedMin} km/h</Text>
              <Text style={styles.rangeSeparator}>até</Text>
              <Text style={styles.rangeValue}>{speedMax} km/h</Text>
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Mínimo</Text>
              <Slider
                style={styles.slider}
                minimumValue={SPEED_MIN}
                maximumValue={SPEED_MAX}
                value={speedMin}
                onValueChange={setSpeedMin}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.inputBackground}
                thumbTintColor={colors.accent}
                step={10}
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Máximo</Text>
              <Slider
                style={styles.slider}
                minimumValue={SPEED_MIN}
                maximumValue={SPEED_MAX}
                value={speedMax}
                onValueChange={setSpeedMax}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.inputBackground}
                thumbTintColor={colors.accent}
                step={10}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ano de Fabricação</Text>

            <View style={styles.rangeValues}>
              <Text style={styles.rangeValue}>{yearMin}</Text>
              <Text style={styles.rangeSeparator}>até</Text>
              <Text style={styles.rangeValue}>{yearMax}</Text>
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Mínimo</Text>
              <Slider
                style={styles.slider}
                minimumValue={YEAR_MIN}
                maximumValue={YEAR_MAX}
                value={yearMin}
                onValueChange={setYearMin}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.inputBackground}
                thumbTintColor={colors.accent}
                step={1}
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Máximo</Text>
              <Slider
                style={styles.slider}
                minimumValue={YEAR_MIN}
                maximumValue={YEAR_MAX}
                value={yearMax}
                onValueChange={setYearMax}
                minimumTrackTintColor={colors.accent}
                maximumTrackTintColor={colors.inputBackground}
                thumbTintColor={colors.accent}
                step={1}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Marcas</Text>
            <Text style={styles.sectionSubtitle}>
              {selectedBrands.length > 0
                ? `${selectedBrands.length} selecionada${selectedBrands.length > 1 ? "s" : ""}`
                : "Nenhuma marca selecionada"}
            </Text>

            <View style={styles.checkboxGrid}>
              {availableBrands.map((brand) => (
                <TouchableOpacity
                  key={brand}
                  style={[
                    styles.checkbox,
                    selectedBrands.includes(brand) && styles.checkboxSelected,
                  ]}
                  onPress={() => toggleBrand(brand)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      selectedBrands.includes(brand)
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={20}
                    color={
                      selectedBrands.includes(brand)
                        ? colors.accent
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.checkboxLabel,
                      selectedBrands.includes(brand) &&
                        styles.checkboxLabelSelected,
                    ]}
                  >
                    {brand}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Combustível</Text>
            <Text style={styles.sectionSubtitle}>
              {selectedFuelTypes.length > 0
                ? `${selectedFuelTypes.length} selecionado${selectedFuelTypes.length > 1 ? "s" : ""}`
                : "Nenhum combustível selecionado"}
            </Text>

            <View style={styles.checkboxList}>
              {fuelTypeOptions.map((fuel) => (
                <TouchableOpacity
                  key={fuel}
                  style={[
                    styles.checkbox,
                    selectedFuelTypes.includes(fuel) && styles.checkboxSelected,
                  ]}
                  onPress={() => toggleFuelType(fuel)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      selectedFuelTypes.includes(fuel)
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={20}
                    color={
                      selectedFuelTypes.includes(fuel)
                        ? colors.accent
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.checkboxLabel,
                      selectedFuelTypes.includes(fuel) &&
                        styles.checkboxLabelSelected,
                    ]}
                  >
                    {fuel}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⚙️ Transmissão</Text>
            <Text style={styles.sectionSubtitle}>
              {selectedTransmissions.length > 0
                ? `${selectedTransmissions.length} selecionada${selectedTransmissions.length > 1 ? "s" : ""}`
                : "Nenhuma transmissão selecionada"}
            </Text>

            <View style={styles.checkboxList}>
              {transmissionOptions.map((trans) => (
                <TouchableOpacity
                  key={trans}
                  style={[
                    styles.checkbox,
                    selectedTransmissions.includes(trans) &&
                      styles.checkboxSelected,
                  ]}
                  onPress={() => toggleTransmission(trans)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      selectedTransmissions.includes(trans)
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={20}
                    color={
                      selectedTransmissions.includes(trans)
                        ? colors.accent
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.checkboxLabel,
                      selectedTransmissions.includes(trans) &&
                        styles.checkboxLabelSelected,
                    ]}
                  >
                    {trans}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔄 Tração</Text>
            <Text style={styles.sectionSubtitle}>
              {selectedDrivetrains.length > 0
                ? `${selectedDrivetrains.length} selecionada${selectedDrivetrains.length > 1 ? "s" : ""}`
                : "Nenhuma tração selecionada"}
            </Text>

            <View style={styles.checkboxList}>
              {drivetrainOptions.map((drive) => (
                <TouchableOpacity
                  key={drive}
                  style={[
                    styles.checkbox,
                    selectedDrivetrains.includes(drive) &&
                      styles.checkboxSelected,
                  ]}
                  onPress={() => toggleDrivetrain(drive)}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={
                      selectedDrivetrains.includes(drive)
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={20}
                    color={
                      selectedDrivetrains.includes(drive)
                        ? colors.accent
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.checkboxLabel,
                      selectedDrivetrains.includes(drive) &&
                        styles.checkboxLabelSelected,
                    ]}
                  >
                    {drive}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApply}
            activeOpacity={0.8}
          >
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
            <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingTop: 50,
      paddingBottom: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    closeButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    headerCenter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    resetButton: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 8,
    },
    resetButtonText: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.accentLight,
    },
    content: {
      flex: 1,
    },
    section: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    sectionSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    rangeValues: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
      gap: 12,
    },
    rangeValue: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.accentLight,
    },
    rangeSeparator: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    sliderContainer: {
      marginBottom: 12,
    },
    sliderLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    slider: {
      width: "100%",
      height: 40,
    },
    checkboxGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    checkboxList: {
      gap: 8,
    },
    checkbox: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      backgroundColor: colors.surface,
      gap: 8,
    },
    checkboxSelected: {
      borderColor: colors.accent,
      backgroundColor: `${colors.accent}10`,
    },
    checkboxLabel: {
      fontSize: 14,
      color: colors.textPrimary,
    },
    checkboxLabelSelected: {
      fontWeight: "600",
      color: colors.accent,
    },
    footer: {
      padding: 16,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.glassBorder,
    },
    applyButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.accent,
      paddingVertical: 16,
      borderRadius: 12,
      gap: 8,
    },
    applyButtonText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#fff",
    },
  });