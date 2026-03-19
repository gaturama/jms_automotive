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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { carService } from "../service/car.service";
import { userService } from "../service/user.service";
import { Car } from "../navigation/car";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { HapticFeedback } from "../utils/Haptics";

type Props = NativeStackScreenProps<RootStackParamList, "AdminPanel">;

type TabType = "cars" | "users";

export default function AdminPanelScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<TabType>("cars");
  const [cars, setCars] = useState<Car[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      if (activeTab === "cars") {
        const result = await carService.getCars({ limit: 100 });
        setCars(result.cars);
      } else {
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
    await loadData();
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
              backgroundColor: "#FF6B6B15",
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

          {activeTab === "cars" && (
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
          )}

          {activeTab === "users" && <View style={{ width: 36 }} />}
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
        {(["cars", "users"] as TabType[]).map((tab) => (
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
                fontSize: 14,
                fontWeight: "600",
                color: activeTab === tab ? colors.accent : colors.textSecondary,
              }}
            >
              {tab === "cars"
                ? `🚗 Carros (${cars.length})`
                : `👥 Usuários (${users.length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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

      {isLoading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
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
