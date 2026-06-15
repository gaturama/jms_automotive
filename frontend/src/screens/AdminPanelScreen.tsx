import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { carService } from "../service/car.service";
import { userService } from "../service/user.service";
import { configService } from "../service/config.service";
import { Car } from "../navigation/car";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { HapticFeedback } from "../utils/Haptics";

type Props = NativeStackScreenProps<RootStackParamList, "AdminPanel">;
type TabType = "cars" | "users" | "config";

export default function AdminPanelScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("cars");
  const [cars, setCars] = useState<Car[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [playlistUrl, setPlaylistUrl] = useState("");
  const [playlistName, setPlaylistName] = useState("");
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  useEffect(() => {
    if (activeTab === "config") {
      loadConfig();
    } else {
      loadData();
    }
  }, [activeTab]);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      const config = await configService.getConfig();
      setPlaylistUrl(config.spotifyPlaylistUrl || "");
      setPlaylistName(config.spotifyPlaylistName || "");
    } catch (error) {
      console.error("Erro ao carregar config:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      if (activeTab === "cars") {
        const result = await carService.getCars({ limit: 100 });
        setCars(result.cars);
      } else if (activeTab === "users") {
        const result = await userService.getUsers();
        setUsers(result);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (activeTab === "config") {
      await loadConfig();
    } else {
      await loadData();
    }
    setRefreshing(false);
  };

  const handleDeleteCar = (car: Car) => {
    HapticFeedback.warning();
    Alert.alert(
      "Deletar Carro",
      `Tem certeza que deseja deletar "${car.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            try {
              await carService.deleteCar(car._id);
              HapticFeedback.success();
              setCars((prev) => prev.filter((c) => c._id !== car._id));
            } catch {
              Alert.alert("Erro", "Não foi possível deletar o carro.");
            }
          },
        },
      ],
    );
  };

  const handleSaveConfig = async () => {
    if (!playlistUrl.trim()) {
      Alert.alert("Atenção", "Cole o link da playlist do Spotify.");
      return;
    }
    if (!playlistUrl.includes("open.spotify.com")) {
      Alert.alert(
        "Link inválido",
        "Use um link válido do Spotify.\nEx: https://open.spotify.com/playlist/...",
      );
      return;
    }

    setIsSavingConfig(true);
    HapticFeedback.medium();

    try {
      await configService.updateConfig({
        spotifyPlaylistUrl: playlistUrl.trim(),
        spotifyPlaylistName: playlistName.trim() || "Playlist JMS Showroom",
      });
      HapticFeedback.success();
      Alert.alert("Salvo!", "Playlist atualizada com sucesso.");
    } catch {
      HapticFeedback.error();
      Alert.alert("Erro", "Não foi possível salvar a playlist.");
    } finally {
      setIsSavingConfig(false);
    }
  };

  const filteredCars = cars.filter(
    (car) =>
      car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      car.brand.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderCar = ({ item }: { item: Car }) => (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.glassBorder,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.textPrimary,
              marginBottom: 4,
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.textSecondary,
              marginBottom: 2,
            }}
          >
            {item.brand} • {item.year}
          </Text>
          <Text
            style={{ fontSize: 13, color: colors.accent, fontWeight: "600" }}
          >
            R$ {item.price.toLocaleString("pt-BR")}
          </Text>
          <Text
            style={{ fontSize: 12, color: colors.textTertiary, marginTop: 4 }}
          >
            {item.horsepower} cv • {item.maxSpeed} km/h
          </Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8, marginLeft: 12 }}>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${colors.accent}15`,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: colors.accent,
            }}
            onPress={() => {
              HapticFeedback.light();
              navigation.navigate("AdminCarForm", { car: item });
            }}
          >
            <Ionicons name="pencil" size={18} color={colors.accent} />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#FF6B6B",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#FF6B6B",
            }}
            onPress={() => handleDeleteCar(item)}
          >
            <Ionicons name="trash" size={18} color="#FF6B6B" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderUser = ({ item }: { item: any }) => (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.glassBorder,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor:
            item.role === "admin" ? colors.accent : colors.inputBackground,
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: item.role === "admin" ? "#fff" : colors.textPrimary,
          }}
        >
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: colors.textPrimary,
            }}
          >
            {item.name}
          </Text>
          {item.role === "admin" && (
            <View
              style={{
                backgroundColor: colors.accent,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: "700", color: "#fff" }}>
                ADMIN
              </Text>
            </View>
          )}
        </View>
        <Text
          style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}
        >
          {item.email}
        </Text>
        <Text
          style={{ fontSize: 11, color: colors.textTertiary, marginTop: 2 }}
        >
          Cadastrado em {new Date(item.createdAt).toLocaleDateString("pt-BR")}
        </Text>
      </View>
    </View>
  );

  const renderConfigTab = () => (
    <ScrollView
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={{
          backgroundColor: colors.surface,
          borderRadius: 20,
          padding: 20,
          marginBottom: 24,
          borderWidth: 1,
          borderColor: colors.glassBorder,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: "#0F766E",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="musical-notes" size={22} color="#0F766E" />
          </View>
          <View>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: colors.textPrimary,
              }}
            >
              Playlist do Spotify
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: 2,
              }}
            >
              Aparece na tela inicial para todos os usuários
            </Text>
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: colors.textSecondary,
              marginBottom: 6,
            }}
          >
            Nome da Playlist
          </Text>
          <TextInput
            value={playlistName}
            onChangeText={setPlaylistName}
            placeholder="Ex: Trilha Sonora JMS Showroom"
            placeholderTextColor={colors.textTertiary}
            style={{
              backgroundColor: colors.inputBackground,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: colors.textPrimary,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.glassBorder,
            }}
          />
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "600",
              color: colors.textSecondary,
              marginBottom: 6,
            }}
          >
            Link da Playlist
          </Text>
          <TextInput
            value={playlistUrl}
            onChangeText={setPlaylistUrl}
            placeholder="https://open.spotify.com/playlist/..."
            placeholderTextColor={colors.textTertiary}
            autoCapitalize="none"
            autoCorrect={false}
            style={{
              backgroundColor: colors.inputBackground,
              borderRadius: 12,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: colors.textPrimary,
              fontSize: 14,
              borderWidth: 1,
              borderColor: colors.glassBorder,
            }}
          />
          {playlistUrl.length > 0 &&
            !playlistUrl.includes("open.spotify.com") && (
              <Text style={{ fontSize: 12, color: "#FF6B6B", marginTop: 6 }}>
                ⚠️ Use um link válido do Spotify
              </Text>
            )}
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "#7C3AED",
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
            opacity: isSavingConfig ? 0.7 : 1,
          }}
          onPress={handleSaveConfig}
          disabled={isSavingConfig}
          activeOpacity={0.8}
        >
          {isSavingConfig ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>
                Salvar Playlist
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {playlistUrl.includes("open.spotify.com") && (
        <View
          style={{
            backgroundColor: "#1DB95415",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: "#1DB95440",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <Ionicons name="checkmark-circle" size={24} color="#0F766E" />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: "#0F766E" }}>
              Preview
            </Text>
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: 2,
              }}
              numberOfLines={1}
            >
              {playlistName || "Playlist JMS Showroom"}
            </Text>
            <Text
              style={{ fontSize: 11, color: colors.textTertiary, marginTop: 2 }}
              numberOfLines={1}
            >
              {playlistUrl}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="light-content" backgroundColor={colors.accent} />

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

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="shield-checkmark" size={20} color="#fff" />
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff" }}>
              Painel Admin
            </Text>
          </View>

          {activeTab === "cars" ? (
            <TouchableOpacity
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => {
                HapticFeedback.light();
                navigation.navigate("AdminCarForm", {});
              }}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 36 }} />
          )}
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
        {(["cars", "users", "config"] as TabType[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderBottomWidth: 2,
              borderBottomColor:
                activeTab === tab ? colors.accent : "transparent",
            }}
            onPress={() => {
              HapticFeedback.selection();
              setActiveTab(tab);
              setSearchQuery("");
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: 13,
                fontWeight: "600",
                color: activeTab === tab ? colors.accent : colors.textSecondary,
              }}
            >
              {tab === "cars"
                ? `🚗 Carros`
                : tab === "users"
                  ? `👥 Usuários`
                  : `⚙️ Config`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab !== "config" && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            margin: 16,
            borderRadius: 12,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: colors.glassBorder,
          }}
        >
          <Ionicons name="search" size={18} color={colors.textSecondary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              activeTab === "cars" ? "Buscar carro..." : "Buscar usuário..."
            }
            placeholderTextColor={colors.textTertiary}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 10,
              color: colors.textPrimary,
              fontSize: 14,
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      ) : activeTab === "config" ? (
        renderConfigTab()
      ) : (
        <FlatList
          data={activeTab === "cars" ? filteredCars : filteredUsers}
          renderItem={activeTab === "cars" ? renderCar : renderUser}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.accent]}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Ionicons
                name={
                  activeTab === "cars" ? "car-sport-outline" : "people-outline"
                }
                size={60}
                color={colors.textTertiary}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: colors.textPrimary,
                  marginTop: 16,
                }}
              >
                Nenhum {activeTab === "cars" ? "carro" : "usuário"} encontrado
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
