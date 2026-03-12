import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export type SortOption = "price-asc" | "price-desc" | "hp-asc" | "hp-desc" | "speed-desc" | "year-desc" | "year-asc";
export type BrandFilter = "all" | "Porsche" | "Ferrari" | "Lamborghini" | "Mercedes-AMG" | "Audi" | "Bentley" | "Koenigsegg" | "BMW" | "McLaren";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  sortBy: SortOption;
  setSortBy: (option: SortOption) => void;
  brandFilter: BrandFilter;
  setBrandFilter: (brand: BrandFilter) => void;
  priceRange: { min: number; max: number };
  setPriceRange: (range: { min: number; max: number }) => void;
  onApply: () => void;
  onReset: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  sortBy,
  setSortBy,
  brandFilter,
  setBrandFilter,
  onApply,
  onReset,
}) => {
  const { colors } = useTheme();

  const sortOptions: { value: SortOption; label: string; icon: string }[] = [
    { value: "price-asc", label: "Menor Preço", icon: "arrow-up" },
    { value: "price-desc", label: "Maior Preço", icon: "arrow-down" },
    { value: "hp-asc", label: "Menor Potência", icon: "flash-outline" },
    { value: "hp-desc", label: "Maior Potência", icon: "flash" },
    { value: "speed-desc", label: "Mais Rápido", icon: "speedometer" },
    { value: "year-desc", label: "Mais Novo", icon: "calendar" },
    { value: "year-asc", label: "Mais Antigo", icon: "calendar-outline" },
  ];

  const brands: BrandFilter[] = [
    "all",
    "Porsche",
    "Ferrari",
    "Lamborghini",
    "Mercedes-AMG",
    "Audi",
    "Bentley",
    "Koenigsegg",
    "BMW",
    "McLaren",
  ];

  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filtros e Ordenação</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ordenar Por</Text>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.optionButton,
                    sortBy === option.value && styles.optionButtonActive,
                  ]}
                  onPress={() => setSortBy(option.value)}
                >
                  <Ionicons
                    name={option.icon as any}
                    size={20}
                    color={sortBy === option.value ? colors.accent : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.optionText,
                      sortBy === option.value && styles.optionTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                  {sortBy === option.value && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Filtrar por Marca</Text>
              <View style={styles.brandGrid}>
                {brands.map((brand) => (
                  <TouchableOpacity
                    key={brand}
                    style={[
                      styles.brandChip,
                      brandFilter === brand && styles.brandChipActive,
                    ]}
                    onPress={() => setBrandFilter(brand)}
                  >
                    <Text
                      style={[
                        styles.brandChipText,
                        brandFilter === brand && styles.brandChipTextActive,
                      ]}
                    >
                      {brand === "all" ? "Todas" : brand}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={onReset}>
              <Ionicons name="refresh" size={20} color={colors.accent} />
              <Text style={styles.resetButtonText}>Limpar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyButton} onPress={onApply}>
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
              <Ionicons name="checkmark" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "flex-end",
    alignSelf: "flex-end",
  },

  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "85%",
    borderWidth: 1,
    borderColor: colors.glassBorder,
    paddingBottom: 0,
    overflow: 'hidden',
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  section: {
    marginTop: 24,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.glassBackground,
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },

  optionButtonActive: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accent,
  },

  optionText: {
    flex: 1,
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 12,
    fontWeight: "500",
  },

  optionTextActive: {
    color: colors.textPrimary,
    fontWeight: "700",
  },

  brandGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  brandChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.glassBackground,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },

  brandChipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  brandChipText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  brandChipTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    gap: 12,
  },

  resetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.accentLight,
    borderWidth: 1,
    borderColor: colors.accent,
    gap: 8,
  },

  resetButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.accent,
  },

  applyButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.accent,
    gap: 8,
    shadowColor: colors.accent,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },

  applyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});