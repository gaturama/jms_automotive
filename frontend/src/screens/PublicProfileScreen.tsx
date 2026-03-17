import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StatusBar,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CarCard } from "../components/CarCard";
import { useAuth } from "../context/AuthContext";
import { HapticFeedback } from "../utils/Haptics";
import { useStats } from "../context/StatsContext";
import { useTheme } from "../context/ThemeContext";
import { createStyles } from "../styles/stylesProfile";
import { useFavorites } from "../components/Favorites";
import { RootStackParamList } from "../navigation/types";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { useUserProfile } from "../context/UserProfileContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "PublicProfile">;

export default function PublicProfileScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);

  const { profile, getProfileCompletionPercentage, reloadProfile } =
    useUserProfile();
  const { stats, getStatsReport } = useStats();
  const { favorites } = useFavorites();
  const { currentUser } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"favorites" | "stats">(
    "favorites",
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const report = getStatsReport();
  const completion = getProfileCompletionPercentage();

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
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

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("PublicProfileScreen recebeu foco, recarregando...");
      reloadProfile();
    });

    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await reloadProfile();
    setRefreshing(false);
  };

  const handleEditProfile = () => {
    HapticFeedback.light();
    navigation.navigate("EditProfile");
  };

  const handleShareProfile = () => {
    HapticFeedback.press();
    Alert.alert("Compartilhar Perfil", `Seu link: ${profile?.profileUrl}`, [
      {
        text: "Copiar Link",
        onPress: () => {
          HapticFeedback.success();
          Alert.alert("Link copiado!");
        },
      },
      { text: "Fechar", style: "cancel" },
    ]);
  };

  const handleCarPress = (car: any) => {
    HapticFeedback.light();
    navigation.navigate("CarDetails", { car });
  };

  if (!profile || !currentUser) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: colors.textPrimary }}>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

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
            height: 200,
            backgroundColor: colors.accent,
            position: "relative",
          }}
        >
          {profile.coverImage ? (
            <Image
              source={{ uri: profile.coverImage }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: colors.accent,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="image-outline"
                size={60}
                color="rgba(255,255,255,0.3)"
              />
            </View>
          )}

          <View
            style={{
              position: "absolute",
              top: 50,
              left: 0,
              right: 0,
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                HapticFeedback.light();
                navigation.goBack();
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShareProfile}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="share-social" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              marginTop: -60,
              marginHorizontal: 16,
              borderRadius: 20,
              padding: 20,
              borderWidth: 1,
              borderColor: colors.glassBorder,
            }}
          >
            <View
              style={{ alignItems: "center", marginTop: -80, marginBottom: 16 }}
            >
              <View
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 60,
                  backgroundColor: colors.accent,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 4,
                  borderColor: colors.surface,
                }}
              >
                {profile.profileImage ? (
                  <Image
                    source={{ uri: profile.profileImage }}
                    style={{ width: 112, height: 112, borderRadius: 56 }}
                  />
                ) : (
                  <Text
                    style={{ fontSize: 48, fontWeight: "700", color: "#fff" }}
                  >
                    {currentUser.name
                      ? currentUser.name.charAt(0).toUpperCase()
                      : "?"}
                  </Text>
                )}
              </View>
            </View>

            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: colors.textPrimary,
                  marginBottom: 4,
                }}
              >
                {currentUser.name || "Sem nome"}
              </Text>

              {profile.location && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Ionicons
                    name="location"
                    size={16}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      marginLeft: 4,
                    }}
                  >
                    {profile.location}
                  </Text>
                </View>
              )}

              {profile.bio ? (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    textAlign: "center",
                    lineHeight: 20,
                  }}
                >
                  {profile.bio}
                </Text>
              ) : (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textTertiary,
                    fontStyle: "italic",
                  }}
                >
                  Sem bio ainda
                </Text>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                paddingVertical: 16,
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderColor: colors.glassBorder,
                marginBottom: 16,
              }}
            >
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: colors.textPrimary,
                  }}
                >
                  {favorites.length}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                  Favoritos
                </Text>
              </View>

              <View style={{ width: 1, backgroundColor: colors.glassBorder }} />

              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "700",
                    color: colors.textPrimary,
                  }}
                >
                  {stats.totalCarViews}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                  Visualizações
                </Text>
              </View>
            </View>

            <View style={{ marginBottom: 16 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text style={{ fontSize: 13, color: colors.textSecondary }}>
                  Perfil Completo
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: colors.textPrimary,
                  }}
                >
                  {completion}%
                </Text>
              </View>
              <View
                style={{
                  height: 8,
                  backgroundColor: colors.inputBackground,
                  borderRadius: 4,
                  overflow: "hidden",
                }}
              >
                <View
                  style={{
                    width: `${completion}%`,
                    height: "100%",
                    backgroundColor: colors.accent,
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: colors.accent,
                paddingVertical: 12,
                borderRadius: 12,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
              onPress={handleEditProfile}
              activeOpacity={0.8}
            >
              <Ionicons name="create" size={20} color="#fff" />
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}>
                Editar Perfil
              </Text>
            </TouchableOpacity>
          </View>

          {profile.favoritesBrand && (
            <View
              style={{
                backgroundColor: colors.surface,
                marginHorizontal: 16,
                marginTop: 16,
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: colors.glassBorder,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: `${colors.accent}20`,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name="star" size={20} color={colors.accent} />
                </View>
                <View>
                  <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                    Marca Favorita
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: colors.textPrimary,
                    }}
                  >
                    {profile.favoritesBrand}
                  </Text>
                </View>
              </View>
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 16,
              marginTop: 20,
              gap: 12,
            }}
          >
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor:
                  activeTab === "favorites" ? colors.accent : colors.surface,
                alignItems: "center",
                borderWidth: 1,
                borderColor:
                  activeTab === "favorites"
                    ? colors.accent
                    : colors.glassBorder,
              }}
              onPress={() => {
                HapticFeedback.selection();
                setActiveTab("favorites");
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color:
                    activeTab === "favorites" ? "#fff" : colors.textPrimary,
                }}
              >
                Favoritos ({favorites.length})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 12,
                borderRadius: 12,
                backgroundColor:
                  activeTab === "stats" ? colors.accent : colors.surface,
                alignItems: "center",
                borderWidth: 1,
                borderColor:
                  activeTab === "stats" ? colors.accent : colors.glassBorder,
              }}
              onPress={() => {
                HapticFeedback.selection();
                setActiveTab("stats");
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: activeTab === "stats" ? "#fff" : colors.textPrimary,
                }}
              >
                Estatísticas
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            {activeTab === "favorites" ? (
              profile.showFavorites ? (
                favorites.length > 0 ? (
                  favorites.map((car) => (
                    <CarCard
                      key={car._id}
                      car={car}
                      onPress={() => handleCarPress(car)}
                    />
                  ))
                ) : (
                  <View
                    style={{
                      backgroundColor: colors.surface,
                      borderRadius: 16,
                      padding: 40,
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: colors.glassBorder,
                    }}
                  >
                    <Ionicons
                      name="heart-outline"
                      size={60}
                      color={colors.textTertiary}
                    />
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "700",
                        color: colors.textPrimary,
                        marginTop: 12,
                      }}
                    >
                      Sem favoritos ainda
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.textSecondary,
                        textAlign: "center",
                        marginTop: 4,
                      }}
                    >
                      Explore a garagem e favorite seus carros preferidos
                    </Text>
                  </View>
                )
              ) : (
                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: 16,
                    padding: 40,
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: colors.glassBorder,
                  }}
                >
                  <Ionicons
                    name="lock-closed"
                    size={60}
                    color={colors.textTertiary}
                  />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: colors.textPrimary,
                      marginTop: 12,
                    }}
                  >
                    Favoritos Privados
                  </Text>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.textSecondary,
                      textAlign: "center",
                      marginTop: 4,
                    }}
                  >
                    Este usuário mantém seus favoritos privados
                  </Text>
                </View>
              )
            ) : profile.showStats ? (
              <View>
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  {[
                    {
                      icon: "eye",
                      label: "Visualizações",
                      value: stats.totalCarViews,
                      color: "#2196F3",
                    },
                    {
                      icon: "heart",
                      label: "Favoritos",
                      value: stats.totalFavorites,
                      color: "#E91E63",
                    },
                    {
                      icon: "git-compare",
                      label: "Comparações",
                      value: stats.totalComparisons,
                      color: "#9C27B0",
                    },
                    {
                      icon: "star",
                      label: "Avaliações",
                      value: stats.totalReviews,
                      color: "#FF9800",
                    },
                  ].map((stat, index) => (
                    <View
                      key={index}
                      style={{
                        flex: 1,
                        backgroundColor: colors.surface,
                        borderRadius: 16,
                        padding: 16,
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: colors.glassBorder,
                      }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: `${stat.color}20`,
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 8,
                        }}
                      >
                        <Ionicons
                          name={stat.icon as any}
                          size={20}
                          color={stat.color}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 24,
                          fontWeight: "700",
                          color: colors.textPrimary,
                        }}
                      >
                        {stat.value}
                      </Text>
                      <Text
                        style={{
                          fontSize: 11,
                          color: colors.textSecondary,
                          textAlign: "center",
                        }}
                      >
                        {stat.label}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  padding: 40,
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: colors.glassBorder,
                }}
              >
                <Ionicons
                  name="lock-closed"
                  size={60}
                  color={colors.textTertiary}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: colors.textPrimary,
                    marginTop: 12,
                  }}
                >
                  Estatísticas Privadas
                </Text>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.textSecondary,
                    textAlign: "center",
                    marginTop: 4,
                  }}
                >
                  Este usuário mantém suas estatísticas privadas
                </Text>
              </View>
            )}
          </View>

          <View style={{ height: 40 }} />
        </Animated.View>
      </ScrollView>
    </View>
  );
}
