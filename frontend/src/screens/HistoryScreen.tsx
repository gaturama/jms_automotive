import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../navigation/types";
import { useViewHistory } from "../context/ViewHistoryContext";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type TabType = "recent" | "mostViewed" | "stats";

export default function HistoryScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const {
    viewHistory,
    clearHistory,
    removeFromHistory,
    getMostViewed,
    getRecentlyViewed,
    getCarViewCount,
  } = useViewHistory();

  const [activeTab, setActiveTab] = useState<TabType>("recent");

  const recentlyViewed = getRecentlyViewed(20);
  const mostViewed = getMostViewed();

  const handleClearHistory = () => {
    Alert.alert(
      "Limpar Histórico",
      "Tem certeza que deseja apagar todo o histórico de visualizações?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: () => clearHistory(),
        },
      ],
    );
  };

  const handleRemoveItem = (carId: string, carName: string) => {
    Alert.alert(
      "Remover do Histórico",
      `Deseja remover "${carName}" do histórico?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => removeFromHistory(carId),
        },
      ],
    );
  };

  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora mesmo";
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays === 1) return "Ontem";
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return `${Math.floor(diffDays / 30)} meses atrás`;
  };

  const renderHistoryItem = ({ item }: any) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: 12,
        padding: 12,
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
      onPress={() => navigation.navigate("CarDetails", { car: item.car })}
      activeOpacity={0.7}
    >
      <View
        style={{
          width: 100,
          height: 80,
          borderRadius: 12,
          backgroundColor: colors.inputBackground,
          overflow: "hidden",
          marginRight: 12,
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="car-sport" size={32} color={colors.textTertiary} />
        </View>
      </View>

      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.textPrimary,
              marginBottom: 4,
            }}
          >
            {item.car.name}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.textSecondary,
            }}
          >
            {item.car.brand} • {item.car.year}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons
                name="time-outline"
                size={14}
                color={colors.textTertiary}
              />
              <Text style={{ fontSize: 12, color: colors.textTertiary }}>
                {formatRelativeTime(item.viewedAt)}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons
                name="eye-outline"
                size={14}
                color={colors.textTertiary}
              />
              <Text style={{ fontSize: 12, color: colors.textTertiary }}>
                {item.viewCount}x
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleRemoveItem(item.car.id, item.car.name)}
            style={{ padding: 4 }}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStatsCard = (
    icon: string,
    label: string,
    value: string,
    color: string,
  ) => (
    <View
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
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: `${color}20`,
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        <Ionicons name={icon as any} size={24} color={color} />
      </View>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          color: colors.textPrimary,
          marginBottom: 4,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontSize: 12,
          color: colors.textSecondary,
          textAlign: "center",
        }}
      >
        {label}
      </Text>
    </View>
  );

  const renderStatsTab = () => {
    const totalViews = viewHistory.reduce(
      (sum, item) => sum + item.viewCount,
      0,
    );
    const uniqueCars = viewHistory.length;
    const avgViews =
      uniqueCars > 0 ? (totalViews / uniqueCars).toFixed(1) : "0";
    const topCar = mostViewed[0];

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          {renderStatsCard(
            "eye",
            "Total de\nVisualizações",
            totalViews.toString(),
            "#4CAF50",
          )}
          {renderStatsCard(
            "car-sport",
            "Carros\nVistos",
            uniqueCars.toString(),
            "#2196F3",
          )}
        </View>

        <View style={{ flexDirection: "row", gap: 12, marginBottom: 24 }}>
          {renderStatsCard(
            "analytics",
            "Média por\nCarro",
            avgViews,
            "#FF9800",
          )}
          {renderStatsCard(
            "trophy",
            "Favorito",
            topCar ? topCar.viewCount.toString() : "0",
            "#9C27B0",
          )}
        </View>

        {topCar && (
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.textPrimary,
                marginBottom: 12,
              }}
            >
              🏆 Carro Mais Visto
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                borderWidth: 2,
                borderColor: colors.accent,
              }}
              onPress={() =>
                navigation.navigate("CarDetails", { car: topCar.car })
              }
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons
                  name="trophy"
                  size={24}
                  color="#FFD700"
                  style={{ marginRight: 8 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: colors.textPrimary,
                  }}
                >
                  {topCar.car.name}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                  {topCar.car.brand} • {topCar.car.year}
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Ionicons name="eye" size={16} color={colors.accent} />
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "700",
                      color: colors.accent,
                    }}
                  >
                    {topCar.viewCount} visualizações
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}

        <View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.textPrimary,
              marginBottom: 12,
            }}
          >
            📊 Top 5 Mais Vistos
          </Text>
          {mostViewed.slice(0, 5).map((item, index) => (
            <TouchableOpacity
              key={item.car.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.surface,
                borderRadius: 12,
                padding: 12,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: colors.glassBorder,
              }}
              onPress={() =>
                navigation.navigate("CarDetails", { car: item.car })
              }
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor:
                    index === 0
                      ? "#FFD700"
                      : index === 1
                        ? "#C0C0C0"
                        : index === 2
                          ? "#CD7F32"
                          : colors.accent,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}
                >
                  {index + 1}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.textPrimary,
                  }}
                >
                  {item.car.name}
                </Text>
                <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                  {item.car.brand}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.accent,
                }}
              >
                {item.viewCount}x
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.accent}
      />

      <View
        style={{
          backgroundColor: colors.accent,
          paddingTop: 50,
          paddingBottom: 16,
          paddingHorizontal: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#fff",
              flex: 1,
              textAlign: "center",
            }}
          >
            Histórico
          </Text>

          <TouchableOpacity onPress={handleClearHistory}>
            <Ionicons name="trash-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.glassBorder,
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 14,
            borderBottomWidth: 2,
            borderBottomColor:
              activeTab === "recent" ? colors.accent : "transparent",
          }}
          onPress={() => setActiveTab("recent")}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              fontWeight: "600",
              color:
                activeTab === "recent" ? colors.accent : colors.textSecondary,
            }}
          >
            Recentes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 14,
            borderBottomWidth: 2,
            borderBottomColor:
              activeTab === "mostViewed" ? colors.accent : "transparent",
          }}
          onPress={() => setActiveTab("mostViewed")}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              fontWeight: "600",
              color:
                activeTab === "mostViewed"
                  ? colors.accent
                  : colors.textSecondary,
            }}
          >
            Mais Vistos
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            paddingVertical: 14,
            borderBottomWidth: 2,
            borderBottomColor:
              activeTab === "stats" ? colors.accent : "transparent",
          }}
          onPress={() => setActiveTab("stats")}
        >
          <Text
            style={{
              textAlign: "center",
              fontSize: 14,
              fontWeight: "600",
              color:
                activeTab === "stats" ? colors.accent : colors.textSecondary,
            }}
          >
            Estatísticas
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        {viewHistory.length === 0 ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Ionicons
              name="time-outline"
              size={80}
              color={colors.textTertiary}
            />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: colors.textPrimary,
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Nenhum histórico ainda
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: colors.textSecondary,
                textAlign: "center",
              }}
            >
              Visualize alguns carros para começar{"\n"}seu histórico!
            </Text>
          </View>
        ) : activeTab === "recent" ? (
          <FlatList
            data={recentlyViewed}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.car.id}
            showsVerticalScrollIndicator={false}
          />
        ) : activeTab === "mostViewed" ? (
          <FlatList
            data={mostViewed}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.car.id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderStatsTab()
        )}
      </View>
    </View>
  );
}