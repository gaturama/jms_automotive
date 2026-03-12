import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BiometricAuthService } from "../service/BiometricAuthService";
import { HapticFeedback } from "../utils/Haptics";
import { useAuth } from "../context/AuthContext";

interface BiometricSettingsSectionProps {
  colors: any;
  styles: any;
}

export const BiometricSettingsSection: React.FC<
  BiometricSettingsSectionProps
> = ({ colors, styles }) => {
  const { currentUser } = useAuth();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState("");
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [requireForSensitiveActions, setRequireForSensitiveActions] =
    useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBiometricSettings();
  }, []);

  const loadBiometricSettings = async () => {
    try {
      const available = await BiometricAuthService.isAvailable();
      setBiometricAvailable(available);

      if (available) {
        const type = await BiometricAuthService.getBiometricType();
        setBiometricType(type);

        const enabled = await BiometricAuthService.isBiometricLoginEnabled();
        setBiometricEnabled(enabled);

        const settings = await BiometricAuthService.getSettings();

        setRequireForSensitiveActions(settings.requireForSensitiveActions);
      }
    } catch (error) {
      console.error("Erro ao carregar configurações de biometria:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBiometricLogin = async () => {
    HapticFeedback.toggle();

    if (biometricEnabled) {
      Alert.alert(
        `Desabilitar ${biometricType}?`,
        "Você precisará digitar email e senah para fazer login.",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Desabilitar",
            style: "destructive",
            onPress: async () => {
              const success =
                await BiometricAuthService.disableBiometricLogin();
              if (success) {
                setBiometricEnabled(false);
                HapticFeedback.success();
                Alert.alert(`${biometricType} desabilitado.`);
              }
            },
          },
        ],
      );
    } else {
      if (!currentUser?.email) {
        Alert.alert("Erro", "Usuário não encontrado.");
        return;
      }

      Alert.alert(
        `Habilitar ${biometricType}?`,
        `Use ${biometricType} para fazer login mais rápido.`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Habilitar",
            onPress: async () => {
              const result = await BiometricAuthService.authenticate(
                `Confirme sua identidade para habilitar ${biometricType}`,
              );

              if (result.success) {
                const success = await BiometricAuthService.enableBiometricLogin(
                  currentUser.email,
                );
                if (success) {
                  setBiometricEnabled(true);
                  HapticFeedback.success();
                  Alert.alert(`${biometricType} habilitado!`);
                }
              }
            },
          },
        ],
      );
    }
  };

  const handleToggleSensitiveActions = async () => {
    HapticFeedback.toggle();

    const newValue = !requireForSensitiveActions;
    const success = await BiometricAuthService.updateSettings({
      requireForSensitiveActions: newValue,
    });

    if (success) {
      setRequireForSensitiveActions(newValue);
      HapticFeedback.success();
    }
  };

  const handleTestBiometric = async () => {
    HapticFeedback.medium();

    const result = await BiometricAuthService.authenticate(
      `Teste de ${biometricType}`,
    );

    if (result.success) {
      HapticFeedback.success();
      Alert.alert("Sucesso!", `${biometricType} funcionando corretamente.`);
    } else {
      HapticFeedback.error();
      Alert.alert("Falhou", result.error || "Autenticação não realizada.");
    }
  };

  if (loading) {
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  }

  if (!biometricAvailable) {
    return (
      <View style={styles.biometricUnavailable}>
        <Ionicons
          name="lock-closed-outline"
          size={40}
          color={colors.textTertiary}
        />
        <Text style={styles.biometricUnavailableText}>
          Biometria não disponível neste dispositivo
        </Text>
        <Text style={styles.biometricUnavailableSubtext}>
          Configure Face ID, Touch ID ou impressão digital nas configurações do
          seu dispositivo.
        </Text>
      </View>
    );
  }
  return (
    <View style={styles.biometricSection}>
      <View style={styles.biometricHeader}>
        <Ionicons name="finger-print" size={24} color={colors.accent} />
        <Text style={styles.biometricHeaderText}>Segurança Biométrica</Text>
      </View>

      <TouchableOpacity
        style={styles.biometricOption}
        onPress={handleToggleBiometricLogin}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Ionicons
            name={biometricType.includes("Face") ? "scan" : "finger-print"}
            size={22}
            color={colors.textSecondary}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.biometricOptionTitle}>
              Login com {biometricType}
            </Text>
            <Text style={styles.biometricOptionSubtitle}>
              {biometricEnabled ? "Habilitado" : "Desabilitado"}
            </Text>
          </View>
        </View>

        <View
          style={{
            width: 50,
            height: 30,
            borderRadius: 15,
            backgroundColor: biometricEnabled
              ? colors.accent
              : colors.inputBackground,
            justifyContent: "center",
            paddingHorizontal: 2,
          }}
        >
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: "#fff",
              alignSelf: biometricEnabled ? "flex-end" : "flex-start",
            }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.biometricOption}
        onPress={handleToggleSensitiveActions}
        activeOpacity={0.8}
      >
        <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
          <Ionicons
            name="shield-checkmark"
            size={22}
            color={colors.textSecondary}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.biometricOptionTitle}>
              Confirmar Ações Sensíveis
            </Text>
            <Text style={styles.biometricOptionSubtitle}>
              Exigir biometria para logout, exclusão, etc.
            </Text>
          </View>
        </View>

        <View
          style={{
            width: 50,
            height: 30,
            borderRadius: 15,
            backgroundColor: requireForSensitiveActions
              ? colors.accent
              : colors.inputBackground,
            justifyContent: "center",
            paddingHorizontal: 2,
          }}
        >
          <View
            style={{
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: "#fff",
              alignSelf: requireForSensitiveActions ? "flex-end" : "flex-start",
            }}
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.biometricTestButton}
        onPress={handleTestBiometric}
        activeOpacity={0.8}
      >
        <Ionicons name="play-circle" size={20} color={colors.accent} />
        <Text style={styles.biometricTestButtonText}>
          Testar {biometricType}
        </Text>
      </TouchableOpacity>

      <View style={styles.biometricInfo}>
        <Ionicons
          name="information-circle"
          size={16}
          color={colors.textTertiary}
        />
        <Text style={styles.biometricInfoText}>
          {biometricType} usa a autenticação nativa do seu dispositivo para
          maior segurança.
        </Text>
      </View>
    </View>
  );
};

export const biometricStyles = {
  biometricSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  biometricHeader: {
    flexDirection: "row" as "row",
    alignItems: "center" as "center",
    marginBottom: 16,
  },
  biometricHeaderText: {
    fontSize: 18,
    fontWeight: "700" as "700",
    marginLeft: 12,
  },
  biometricOption: {
    flexDirection: "row" as "row",
    alignItems: "center" as "center",
    justifyContent: "space-between" as "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  biometricOptionTitle: {
    fontSize: 15,
    fontWeight: "600" as "600",
  },
  biometricOptionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  biometricTestButton: {
    flexDirection: "row" as "row",
    alignItems: "center" as "center",
    justifyContent: "center" as "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  biometricTestButtonText: {
    fontSize: 14,
    fontWeight: "600" as "600",
    marginLeft: 8,
  },
  biometricInfo: {
    flexDirection: "row" as "row",
    alignItems: "flex-start" as "flex-start",
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
  },
  biometricInfoText: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  biometricUnavailable: {
    padding: 30,
    alignItems: "center" as "center",
  },
  biometricUnavailableText: {
    fontSize: 16,
    fontWeight: "600" as "600",
    textAlign: "center" as "center",
    marginTop: 12,
  },
  biometricUnavailableSubtext: {
    fontSize: 13,
    textAlign: "center" as "center",
    marginTop: 8,
    lineHeight: 20,
  },
};
