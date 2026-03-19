import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { carService } from "../service/car.service";
import { HapticFeedback } from "../utils/Haptics";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "AdminCarForm">;

export default function AdminCarFormScreen({ navigation, route }: Props) {
  const { colors } = useTheme();
  const editingCar = route.params?.car;
  const isEditing = !!editingCar;

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: editingCar?.name || "",
    brand: editingCar?.brand || "",
    carModel: editingCar?.carModel || "",
    year: editingCar?.year?.toString() || "",
    engine: editingCar?.engine || "",
    horsepower: editingCar?.horsepower?.toString() || "",
    torque: editingCar?.torque || "",
    transmission: editingCar?.transmission || "",
    drivetrain: editingCar?.drivetrain || "",
    fuelType: editingCar?.fuelType || "",
    maxSpeed: editingCar?.maxSpeed?.toString() || "",
    acceleration: editingCar?.acceleration || "",
    weight: editingCar?.weight?.toString() || "",
    price: editingCar?.price?.toString() || "",
    description: editingCar?.description || "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const required = [
      "name",
      "brand",
      "carModel",
      "year",
      "engine",
      "horsepower",
      "torque",
      "transmission",
      "drivetrain",
      "fuelType",
      "maxSpeed",
      "acceleration",
      "weight",
      "price",
      "description",
    ];
    const empty = required.find((f) => !form[f as keyof typeof form].trim());

    if (empty) {
      Alert.alert("Campo obrigatório", `Preencha o campo: ${empty}`);
      return;
    }

    setIsLoading(true);
    HapticFeedback.medium();

    try {
      const payload = {
        ...form,
        year: Number(form.year),
        horsepower: Number(form.horsepower),
        maxSpeed: Number(form.maxSpeed),
        weight: Number(form.weight),
        price: Number(form.price),
      };

      if (isEditing) {
        await carService.updateCar(editingCar._id, payload);
        Alert.alert("Sucesso!", "Carro atualizado com sucesso.");
      } else {
        await carService.createCar(payload);
        Alert.alert("Sucesso!", "Carro cadastrado com sucesso.");
      }

      HapticFeedback.success();
      navigation.goBack();
    } catch (err) {
      HapticFeedback.error();
      Alert.alert("Erro", "Não foi possível salvar o carro.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    label: string,
    field: string,
    placeholder: string,
    numeric = false,
  ) => (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: colors.textSecondary,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={form[field as keyof typeof form]}
        onChangeText={(v) => handleChange(field, v)}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        keyboardType={numeric ? "numeric" : "default"}
        style={{
          backgroundColor: colors.surface,
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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "700", color: "#fff" }}>
          {isEditing ? "Editar Carro" : "Novo Carro"}
        </Text>
        <TouchableOpacity onPress={handleSave} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="checkmark" size={28} color="#fff" />
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.textPrimary,
              marginBottom: 16,
            }}
          >
            Informações Básicas
          </Text>
          {renderInput("Nome", "name", "Ex: Nissan Skyline GTR R34")}
          {renderInput("Marca", "brand", "Ex: Nissan")}
          {renderInput("Modelo", "carModel", "Ex: Skyline GTR R34")}
          {renderInput("Ano", "year", "Ex: 1999", true)}
          {renderInput("Preço (R$)", "price", "Ex: 1200000", true)}

          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.textPrimary,
              marginBottom: 16,
              marginTop: 8,
            }}
          >
            Motor e Desempenho
          </Text>
          {renderInput("Motor", "engine", "Ex: 2.6L Biturbo")}
          {renderInput("Potência (cv)", "horsepower", "Ex: 280", true)}
          {renderInput("Torque", "torque", "Ex: 40 kgfm")}
          {renderInput("Vel. Máxima (km/h)", "maxSpeed", "Ex: 250", true)}
          {renderInput("Aceleração 0-100", "acceleration", "Ex: 5,4s")}

          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.textPrimary,
              marginBottom: 16,
              marginTop: 8,
            }}
          >
            Especificações
          </Text>
          {renderInput("Transmissão", "transmission", "Ex: Manual 6 marchas")}
          {renderInput("Tração", "drivetrain", "Ex: AWD (Tração Integral)")}
          {renderInput("Combustível", "fuelType", "Ex: Gasolina")}
          {renderInput("Peso (kg)", "weight", "Ex: 1540", true)}

          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.textPrimary,
              marginBottom: 16,
              marginTop: 8,
            }}
          >
            Descrição
          </Text>
          <View style={{ marginBottom: 16 }}>
            <TextInput
              value={form.description}
              onChangeText={(v) => handleChange("description", v)}
              placeholder="Descreva o carro..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={5}
              style={{
                backgroundColor: colors.surface,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: colors.textPrimary,
                fontSize: 14,
                borderWidth: 1,
                borderColor: colors.glassBorder,
                minHeight: 120,
                textAlignVertical: "top",
              }}
            />
          </View>

          <TouchableOpacity
            style={{
              backgroundColor: colors.accent,
              paddingVertical: 16,
              borderRadius: 14,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              opacity: isLoading ? 0.7 : 1,
            }}
            onPress={handleSave}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={22} color="#fff" />
                <Text
                  style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}
                >
                  {isEditing ? "Salvar Alterações" : "Cadastrar Carro"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
