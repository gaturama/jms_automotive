import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
  ScrollView,
  RefreshControl,
} from "react-native";
import {
  BrandFilter,
  FilterModal,
  SortOption,
} from "../components/FilterModal";
import {
  SkeletonCarCard,
  SkeletonSearchBar,
  SkeletonFilterRow,
  SkeletonStatCard,
} from "../components/SkeletonComponents";
import { Car } from "../navigation/car";
import { Ionicons } from "@expo/vector-icons";
import { CarCard } from "../components/CarCard";
import { useAuth } from "../context/AuthContext";
import { HapticFeedback } from "../utils/Haptics";
import { useTheme } from "../context/ThemeContext";
import { SearchBar } from "../components/SearchBar";
import { createStyles } from "../styles/stylesHome";
import { carService } from "../service/car.service";
import { CarOfTheDay } from "../components/CarOfTheDay";
import { SpotifyPlayer } from "../components/SpotifyPlayer";
import { RootStackParamList } from "../navigation/types";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { AdvancedFilterHelper } from "../utils/AdvancedFilterHelper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  AdvancedSearchModal,
  AdvancedFilters,
} from "../components/AdvancedSearchModal";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [cars, setCars] = useState<Car[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("price-desc");
  const [brandFilter, setBrandFilter] = useState<BrandFilter>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { currentUser } = useAuth();

  const [advancedFiltersVisible, setAdvancedFiltersVisible] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>(
    AdvancedFilterHelper.createDefaultFilters(),
  );
  const [defaultFilters] = useState<AdvancedFilters>(
    AdvancedFilterHelper.createDefaultFilters(),
  );

  const styles = useThemedStyles(createStyles);
  const { colors } = useTheme();

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
    loadData();
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await carService.getCars({ limit: 100 });
      setCars(result.cars);
    } catch (error) {
      console.error("Erro ao carregar carros:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const filteredAndSortedCars = useMemo(() => {
    let filtered = AdvancedFilterHelper.applyFilters(
      cars,
      advancedFilters,
      searchQuery,
    );

    if (brandFilter !== "all" && advancedFilters.brands.length === 0) {
      filtered = filtered.filter((car) => car.brand === brandFilter);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "hp-asc":
          return a.horsepower - b.horsepower;
        case "hp-desc":
          return b.horsepower - a.horsepower;
        case "speed-desc":
          return b.maxSpeed - a.maxSpeed;
        case "year-desc":
          return b.year - a.year;
        case "year-asc":
          return a.year - b.year;
        default:
          return 0;
      }
    });

    return filtered;
  }, [cars, searchQuery, sortBy, brandFilter, advancedFilters]);

  const handleProfile = () => {
    HapticFeedback.light();
    navigation.navigate("Profile");
  };

  const handleCarPress = (car: Car) => {
    HapticFeedback.light();
    navigation.navigate("CarDetails", { car });
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    HapticFeedback.selection();
  };

  const handleApplyFilters = () => setFilterModalVisible(false);

  const handleResetFilters = () => {
    setSortBy("year-asc");
    setBrandFilter("all");
  };

  const handleOpenAdvancedSearch = () => {
    HapticFeedback.light();
    setAdvancedFiltersVisible(true);
  };

  const handleApplyAdvancedFilters = (filters: AdvancedFilters) => {
    HapticFeedback.success();
    setAdvancedFilters(filters);
  };

  const handleResetAdvancedFilters = () => {
    HapticFeedback.warning();
    setAdvancedFilters(AdvancedFilterHelper.createDefaultFilters());
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (sortBy !== "year-asc") count++;
    if (brandFilter !== "all") count++;
    return count;
  };

  const hasActiveFilters = AdvancedFilterHelper.hasActiveFilters(
    advancedFilters,
    defaultFilters,
  );
  const activeFiltersCount = AdvancedFilterHelper.countActiveFilters(
    advancedFilters,
    defaultFilters,
  );
  const availableBrands = useMemo(
    () => AdvancedFilterHelper.extractUniqueBrands(cars),
    [cars],
  );

  const ListHeader = useCallback(
    () => (
      <Animated.View
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={handleClearSearch}
          placeholder="Buscar por nome, marca ou modelo..."
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRowScrollContent}
          style={styles.filterRowScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              hasActiveFilters && {
                backgroundColor: colors.accent,
                borderColor: colors.accent,
              },
            ]}
            onPress={handleOpenAdvancedSearch}
          >
            <Ionicons
              name="search"
              size={20}
              color={hasActiveFilters ? "#fff" : colors.textPrimary}
            />
            <Text
              style={[
                styles.filterButtonText,
                hasActiveFilters && { color: "#fff" },
              ]}
            >
              Busca Avançada
            </Text>
            {activeFiltersCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => {
              HapticFeedback.light();
              setFilterModalVisible(true);
            }}
          >
            <Ionicons name="options" size={20} color={colors.textPrimary} />
            <Text style={styles.filterButtonText}>Ordenar</Text>
            {getActiveFilterCount() > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>
                  {getActiveFilterCount()}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.compareButton}
            onPress={() => {
              HapticFeedback.light();
              navigation.navigate("Compare");
            }}
          >
            <Ionicons name="git-compare" size={18} color={colors.textPrimary} />
            <Text style={styles.filterButtonText}>Comparar Carros</Text>
          </TouchableOpacity>
        </ScrollView>

        <SpotifyPlayer />

        <View style={styles.resultCountContainer}>
          <Text style={styles.resultCountText}>
            {filteredAndSortedCars.length}{" "}
            {filteredAndSortedCars.length === 1
              ? "carro encontrado"
              : "carros encontrados"}
          </Text>
        </View>

        {filteredAndSortedCars.length > 0 && (
          <Animated.View
            style={[
              styles.statsBar,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {filteredAndSortedCars.length}
              </Text>
              <Text style={styles.statLabel}>Carros</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {filteredAndSortedCars.reduce(
                  (acc, car) => acc + car.horsepower,
                  0,
                )}
              </Text>
              <Text style={styles.statLabel}>HP Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                R${" "}
                {(
                  filteredAndSortedCars.reduce(
                    (acc, car) => acc + car.price,
                    0,
                  ) / 1000000
                ).toFixed(1)}
                M
              </Text>
              <Text style={styles.statLabel}>Valor</Text>
            </View>
          </Animated.View>
        )}

        <CarOfTheDay
          onPress={(car) => navigation.navigate("CarDetails", { car })}
        />
      </Animated.View>
    ),
    [filteredAndSortedCars, searchQuery, hasActiveFilters, activeFiltersCount],
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.accent}
      />

      <View style={styles.backgroundParticles}>
        <Animated.View style={[styles.particle, styles.particle1]} />
        <Animated.View style={[styles.particle, styles.particle2]} />
        <Animated.View style={[styles.particle, styles.particle3]} />
      </View>

      <Animated.View
        style={[
          styles.header,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            HapticFeedback.light();
            navigation.navigate("Favorites");
          }}
          style={styles.headerButton}
        >
          <Ionicons name="heart" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Ionicons
            name="car-sport"
            size={24}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.headerTitle}>Garagem Premium</Text>
        </View>

        <TouchableOpacity onPress={handleProfile} style={styles.headerButton}>
          <Ionicons name="person-circle" size={28} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {isLoading ? (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <SkeletonSearchBar />
          <SkeletonFilterRow />
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              paddingHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </View>
          <View style={{ paddingHorizontal: 16 }}>
            <SkeletonCarCard />
            <SkeletonCarCard />
            <SkeletonCarCard />
            <SkeletonCarCard />
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredAndSortedCars}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={<ListHeader />}
          renderItem={({ item }) => (
            <CarCard car={item} onPress={() => handleCarPress(item)} />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons
                name="car-sport-outline"
                size={80}
                color={colors.textTertiary}
              />
              <Text style={styles.emptyTitle}>Nenhum carro encontrado</Text>
              <Text style={styles.emptyText}>
                Tente ajustar sua busca ou filtros
              </Text>
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => {
                  setSearchQuery("");
                  handleResetFilters();
                  handleResetAdvancedFilters();
                }}
              >
                <Text style={styles.emptyButtonText}>Limpar Filtros</Text>
              </TouchableOpacity>
            </View>
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.accent]}
              tintColor={colors.accentLight}
              progressBackgroundColor={colors.surface}
            />
          }
        />
      )}

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        sortBy={sortBy}
        setSortBy={setSortBy}
        brandFilter={brandFilter}
        setBrandFilter={setBrandFilter}
        priceRange={{ min: 0, max: 50000000 }}
        setPriceRange={() => {}}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
      />

      <AdvancedSearchModal
        visible={advancedFiltersVisible}
        onClose={() => setAdvancedFiltersVisible(false)}
        onApply={handleApplyAdvancedFilters}
        currentFilters={advancedFilters}
        availableBrands={availableBrands}
      />

      {!isLoading && (
        <>
          <TouchableOpacity
            style={styles.fab}
            onPress={() => {
              HapticFeedback.medium();
              navigation.navigate("Chatbot");
            }}
            activeOpacity={0.8}
          >
            <Ionicons name="rocket" size={28} color="#fff" />
          </TouchableOpacity>

          {currentUser?.role === "admin" && (
            <TouchableOpacity
              style={[styles.fab, { bottom: 90, backgroundColor: "#FF6B6B" }]}
              onPress={() => {
                HapticFeedback.medium();
                navigation.navigate("AdminPanel");
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="shield-checkmark" size={28} color="#fff" />
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}
