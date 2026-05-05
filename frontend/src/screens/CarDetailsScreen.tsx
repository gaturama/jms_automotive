import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import {
  SkeletonText,
  SkeletonHighlightCard,
  SkeletonListItem,
  SkeletonReview,
} from "../components/SkeletonComponents";
import { Ionicons } from "@expo/vector-icons";
import { HapticFeedback } from "../utils/Haptics";
import { useStats } from "../context/StatsContext";
import { useTheme } from "../context/ThemeContext";
import { ShareModal } from "../components/ShareModal";
import { useFavorites } from "../components/Favorites";
import { RootStackParamList } from "../navigation/types";
import { createStyles } from "../styles/stylesCarDetails";
import { useThemedStyles } from "../hooks/useThemedStyles";
import CarDetailsModal from "../components/CarDetailsModal";
import { RatingsSection } from "../components/RatingsSection";
import { useViewHistory } from "../context/ViewHistoryContext";
import { useRatings } from "../context/RatingsContext";
import { ImageGalleryModal } from "../components/ImageGalleryModal";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { getCarImages } from "../data/carImages";

interface SpecRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}

type Props = NativeStackScreenProps<RootStackParamList, "CarDetails">;

export default function CarDetailsScreen({ navigation, route }: Props) {
  const { car } = route.params;
  const { isFavorite, toggleFavorite } = useFavorites();
  const [favorites, setFavorites] = useState(isFavorite(car._id));
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { addToHistory } = useViewHistory();
  const { loadCarReviews } = useRatings();
  const { recordCarView, recordFavorite, recordShare } = useStats();

  const [isLoadingInfo, setIsLoadingInfo] = useState(true);
  const [isLoadingSpecs, setIsLoadingSpecs] = useState(true);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const carLocalImages = getCarImages(car.name);

  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const heartScale = useRef(new Animated.Value(1)).current;

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

    loadDataProgressively();
    addToHistory(car);
    recordCarView(car._id);
  }, []);

  useEffect(() => {
    setFavorites(isFavorite(car._id));
  }, [car._id, isFavorite]);

  const loadDataProgressively = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoadingInfo(false);

    await new Promise((resolve) => setTimeout(resolve, 400));
    setIsLoadingSpecs(false);

    try {
      await loadCarReviews(car._id);
    } catch (error) {
      console.error("Erro ao carregar reviews:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCarReviews(car._id);
    setRefreshing(false);
  };

  const SpecRow: React.FC<SpecRowProps> = ({ icon, label, value }) => (
    <View style={styles.specRow}>
      <View style={styles.specLeft}>
        <Ionicons name={icon} size={20} color={colors.textPrimary} />
        <Text style={styles.specLabel}>{label}</Text>
      </View>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );

  const handleToggleFavorite = () => {
    Animated.sequence([
      Animated.timing(heartScale, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(heartScale, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    const isAdding = !favorites;
    toggleFavorite(car);
    setFavorites(isAdding);
    recordFavorite(car._id, isAdding);
    isAdding ? HapticFeedback.favorite() : HapticFeedback.delete();
  };

  const handleShare = () => {
    setShareModalVisible(true);
    recordShare();
    HapticFeedback.press();
  };

  const handleImagePress = (index: number) => {
    setSelectedImageIndex(index);
    setGalleryVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.accent}
      />

      <View style={styles.header}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 8,
            paddingTop: 50,
            paddingBottom: 12,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#fff",
              letterSpacing: 0.5,
            }}
          >
            {car.brand}
          </Text>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              onPress={handleShare}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="share-social" size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleToggleFavorite}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                <Ionicons
                  name={favorites ? "heart" : "heart-outline"}
                  size={24}
                  color="#fff"
                />
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

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
        <View
          style={{
            height: 300,
            backgroundColor: colors.surface,
            position: "relative",
          }}
        >
          {carLocalImages.length > 0 ? (
            <>
              <FlatList
                data={carLocalImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => handleImagePress(index)}
                  >
                    <Image
                      source={item}
                      style={{ width: 400, height: 300 }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  bottom: 16,
                  right: 16,
                  backgroundColor: "rgba(0,0,0,0.7)",
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
                onPress={() => setGalleryVisible(true)}
              >
                <Ionicons name="images" size={20} color="#fff" />
                <Text
                  style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}
                >
                  Ver todas ({carLocalImages.length})
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="images-outline"
                size={60}
                color={colors.textTertiary}
              />
              <Text
                style={{
                  color: colors.textPrimary,
                  marginTop: 12,
                  fontSize: 16,
                  fontWeight: "600",
                }}
              >
                {car.name}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  marginTop: 8,
                  fontSize: 14,
                }}
              >
                Nenhuma imagem disponível
              </Text>
            </View>
          )}
        </View>

        <Animated.View
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
        >
          <View style={styles.mainInfo}>
            <Text style={styles.carName}>{car.name}</Text>
            <Text style={styles.carModel}>
              {car.carModel} • {car.year}
            </Text>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Valor</Text>
              <Text style={styles.price}>
                R$ {car.price.toLocaleString("pt-BR")}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <Text style={styles.sectionTitle}>Sobre o veículo</Text>
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 12,
                  backgroundColor: `${colors.accent}15`,
                  borderWidth: 1,
                  borderColor: colors.accent,
                }}
                onPress={() => {
                  HapticFeedback.light();
                  setDetailsModalVisible(true);
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: colors.accentLight,
                    marginRight: 4,
                  }}
                >
                  Ver Mais
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.accent}
                />
              </TouchableOpacity>
            </View>
            {isLoadingInfo ? (
              <SkeletonText lines={4} spacing={8} lastLineWidth="85%" />
            ) : (
              <Text style={styles.description}>{car.description}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Destaques</Text>
            {isLoadingInfo ? (
              <View style={styles.highlightsGrid}>
                <SkeletonHighlightCard />
                <SkeletonHighlightCard />
                <SkeletonHighlightCard />
                <SkeletonHighlightCard />
              </View>
            ) : (
              <View style={styles.highlightsGrid}>
                <View style={styles.highlightCard}>
                  <Ionicons
                    name="speedometer-outline"
                    size={28}
                    color="#4CAF50"
                  />
                  <Text style={styles.highlightValue}>{car.maxSpeed} km/h</Text>
                  <Text style={styles.highlightLabel}>Velocidade Máx.</Text>
                </View>
                <View style={styles.highlightCard}>
                  <Ionicons name="flash-outline" size={28} color="#FF9800" />
                  <Text style={styles.highlightValue}>{car.acceleration}</Text>
                  <Text style={styles.highlightLabel}>0-100 km/h</Text>
                </View>
                <View style={styles.highlightCard}>
                  <Ionicons
                    name="hardware-chip-outline"
                    size={28}
                    color="#2196F3"
                  />
                  <Text style={styles.highlightValue}>{car.horsepower} cv</Text>
                  <Text style={styles.highlightLabel}>Potência</Text>
                </View>
                <View style={styles.highlightCard}>
                  <Ionicons name="scale-outline" size={28} color="#9C27B0" />
                  <Text style={styles.highlightValue}>{car.weight} kg</Text>
                  <Text style={styles.highlightLabel}>Peso</Text>
                </View>
              </View>
            )}
          </View>

          {carLocalImages.length > 0 && (
            <View style={styles.section}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                <Text style={styles.sectionTitle}>
                  Galeria ({carLocalImages.length} fotos)
                </Text>
                <TouchableOpacity onPress={() => setGalleryVisible(true)}>
                  <Text
                    style={{
                      color: colors.accentLight,
                      fontSize: 14,
                      fontWeight: "600",
                    }}
                  >
                    Ver todas →
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {carLocalImages.slice(0, 6).map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    style={{
                      width: "48%",
                      height: 150,
                      borderRadius: 12,
                      overflow: "hidden",
                    }}
                    onPress={() => handleImagePress(index)}
                  >
                    <Image
                      source={image}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                    {index === 5 && carLocalImages.length > 6 && (
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "rgba(0,0,0,0.6)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 28,
                            fontWeight: "700",
                          }}
                        >
                          +{carLocalImages.length - 6}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Especificações Técnicas</Text>
            {isLoadingSpecs ? (
              <View style={styles.specsContainer}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonListItem key={i} />
                ))}
              </View>
            ) : (
              <View style={styles.specsContainer}>
                <SpecRow
                  icon="calendar-outline"
                  label="Ano de Fabricação"
                  value={car.year.toString()}
                />
                <SpecRow icon="car-outline" label="Marca" value={car.brand} />
                <SpecRow
                  icon="car-sport-outline"
                  label="Modelo"
                  value={car.carModel}
                />
                <SpecRow
                  icon="build-outline"
                  label="Motor"
                  value={car.engine}
                />
                <SpecRow
                  icon="flash-outline"
                  label="Potência"
                  value={`${car.horsepower} cv`}
                />
                <SpecRow
                  icon="git-merge-outline"
                  label="Torque"
                  value={car.torque}
                />
                <SpecRow
                  icon="settings-outline"
                  label="Transmissão"
                  value={car.transmission}
                />
                <SpecRow
                  icon="swap-horizontal-outline"
                  label="Tração"
                  value={car.drivetrain}
                />
                <SpecRow
                  icon="water-outline"
                  label="Combustível"
                  value={car.fuelType}
                />
                <SpecRow
                  icon="speedometer-outline"
                  label="Vel. Máxima"
                  value={`${car.maxSpeed} km/h`}
                />
                <SpecRow
                  icon="timer-outline"
                  label="Aceleração 0-100"
                  value={car.acceleration}
                />
                <SpecRow
                  icon="scale-outline"
                  label="Peso"
                  value={`${car.weight} kg`}
                />
              </View>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Avaliações</Text>
            {isLoadingReviews ? (
              <>
                <SkeletonReview />
                <SkeletonReview />
              </>
            ) : (
              <RatingsSection car={car} />
            )}
          </View>

          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={[styles.actionButton, { flex: 1 }]}
              activeOpacity={0.8}
              onPress={handleShare}
            >
              <Ionicons name="share-social" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Compartilhar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { flex: 1.5 }]}
              activeOpacity={0.8}
              onPress={() => {
                HapticFeedback.medium();
              }}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Entrar em Contato</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomSpacing} />
        </Animated.View>
      </ScrollView>

      <ShareModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        car={car}
      />

      {carLocalImages.length > 0 && (
        <ImageGalleryModal
          visible={galleryVisible}
          images={carLocalImages}
          initialIndex={selectedImageIndex}
          onClose={() => setGalleryVisible(false)}
        />
      )}

      <CarDetailsModal
        visible={detailsModalVisible}
        onClose={() => setDetailsModalVisible(false)}
        car={car}
      />
    </View>
  );
}
