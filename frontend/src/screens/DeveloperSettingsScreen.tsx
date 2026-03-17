import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HapticFeedback } from "../utils/Haptics";
import { useTheme } from "../context/ThemeContext";
import { RootStackParamList } from "../navigation/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "DeveloperSettings">;

interface StorageItem {
  key: string;
  value: string;
  size: number;
}

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export default function DeveloperSettingsScreen({ navigation }: Props) {
  const { colors, theme } = useTheme();
  const [storageData, setStorageData] = useState<StorageItem[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    {
      id: "advanced_search",
      name: "Busca Avançada",
      description: "Filtros complexos de busca",
      enabled: true,
    },
    {
      id: "chatbot",
      name: "Chatbot Assistente",
      description: "Assistente virtual com IA",
      enabled: true,
    },
    {
      id: "biometric_auth",
      name: "Autenticação Biométrica",
      description: "Face ID / Touch ID",
      enabled: false,
    },
    {
      id: "skeleton_screens",
      name: "Skeleton Screens",
      description: "Loading states animados",
      enabled: true,
    },
    {
      id: "haptic_feedback",
      name: "Haptic Feedback",
      description: "Vibrações nas interações",
      enabled: true,
    },
    {
      id: "debug_mode",
      name: "Debug Mode",
      description: "Logs detalhados no console",
      enabled: false,
    },
  ]);

  useEffect(() => {
    loadStorageData();
    loadLogs();
    loadFeatureFlags();
  }, []);

  const loadStorageData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items: StorageItem[] = [];
      let total = 0;

      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          const size = new Blob([value]).size;
          items.push({ key, value, size });
          total += size;
        }
      }

      items.sort((a, b) => b.size - a.size);
      setStorageData(items);
      setTotalSize(total);
    } catch (error) {
      console.error("Error loading storage:", error);
    }
  };

  const loadLogs = () => {
    const mockLogs = [
      `[${new Date().toISOString()}] App iniciado`,
      `[${new Date().toISOString()}] Usuário autenticado`,
      `[${new Date().toISOString()}] 50 carros carregados`,
      `[${new Date().toISOString()}] Tema aplicado: ${theme === "dark" ? "dark" : "light"}`,
      `[${new Date().toISOString()}] Cache atualizado`,
    ];
    setLogs(mockLogs);
  };

  const loadFeatureFlags = async () => {
    try {
      const saved = await AsyncStorage.getItem("@DevMode:featureFlags");
      if (saved) {
        setFeatureFlags(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Error loading feature flags:", error);
    }
  };

  const saveFeatureFlags = async (flags: FeatureFlag[]) => {
    try {
      await AsyncStorage.setItem(
        "@DevMode:featureFlags",
        JSON.stringify(flags),
      );
      setFeatureFlags(flags);
    } catch (error) {
      console.error("Error saving feature flags:", error);
    }
  };

  const toggleFeatureFlag = (id: string) => {
    HapticFeedback.selection();
    const updated = featureFlags.map((flag) =>
      flag.id === id ? { ...flag, enabled: !flag.enabled } : flag,
    );
    saveFeatureFlags(updated);
  };

  const handleClearCache = () => {
    HapticFeedback.warning();
    Alert.alert(
      "🗑️ Limpar Cache",
      "Tem certeza que deseja limpar todo o cache? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            try {
              const keysToKeep = [
                "@CarShowroom:token",
                "@CarShowroom:refresh",
                "@CarShowroom:biometricSettings",
                "@DevMode:featureFlags",
              ];

              const allKeys = await AsyncStorage.getAllKeys();
              const keysToRemove = allKeys.filter(
                (key) => !keysToKeep.includes(key),
              );

              await AsyncStorage.multiRemove(keysToRemove);

              HapticFeedback.success();
              Alert.alert(
                "✅ Cache Limpo!",
                `${keysToRemove.length} itens removidos.`,
              );
              loadStorageData();
            } catch (error) {
              HapticFeedback.error();
              Alert.alert("❌ Erro", "Não foi possível limpar o cache.");
            }
          },
        },
      ],
    );
  };

  const handleClearAllData = () => {
    HapticFeedback.warning();
    Alert.alert(
      "⚠️ ATENÇÃO!",
      "Isso vai apagar TODOS os dados incluindo:\n\n• Usuários\n• Favoritos\n• Histórico\n• Configurações\n\nEsta ação não pode ser desfeita!",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar Tudo",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              HapticFeedback.success();
              Alert.alert(
                "✅ Dados Apagados!",
                "Todos os dados foram removidos. O app será reiniciado.",
                [
                  {
                    text: "OK",
                    onPress: () => {
                      navigation.reset({
                        index: 0,
                        routes: [{ name: "Login" }],
                      });
                    },
                  },
                ],
              );
            } catch (error) {
              HapticFeedback.error();
              Alert.alert("❌ Erro", "Não foi possível apagar os dados.");
            }
          },
        },
      ],
    );
  };

  const handleViewStorageItem = (item: StorageItem) => {
    HapticFeedback.light();

    let displayValue = item.value;
    try {
      const parsed = JSON.parse(item.value);
      displayValue = JSON.stringify(parsed, null, 2);
    } catch {}

    Alert.alert(
      item.key,
      displayValue.substring(0, 500) + (displayValue.length > 500 ? "..." : ""),
      [
        { text: "Fechar" },
        {
          text: "Copiar",
          onPress: () => {
            Alert.alert("✅", "Copiado!");
          },
        },
        {
          text: "Deletar",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem(item.key);
            loadStorageData();
            Alert.alert("✅", "Item deletado!");
          },
        },
      ],
    );
  };

  const handleExportLogs = () => {
    HapticFeedback.light();
    const logsText = logs.join("\n");
    Alert.alert("📋 Logs Exportados", logsText, [
      { text: "Fechar" },
      {
        text: "Copiar",
        onPress: () => Alert.alert("✅", "Logs copiados!"),
      },
    ]);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.accent}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            HapticFeedback.light();
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Ionicons name="code-slash" size={24} color="#fff" />
          <Text style={styles.headerTitle}>Developer Settings</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="server" size={20} color={colors.accent} />
            <Text style={styles.sectionTitle}>AsyncStorage</Text>
          </View>

          <View style={styles.storageInfo}>
            <Text style={styles.storageInfoText}>
              Total: {storageData.length} itens • {formatBytes(totalSize)}
            </Text>
          </View>

          <View style={styles.storageActions}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={loadStorageData}
            >
              <Ionicons name="refresh" size={18} color={colors.accent} />
              <Text style={styles.buttonSecondaryText}>Atualizar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonWarning]}
              onPress={handleClearCache}
            >
              <Ionicons name="trash-bin" size={18} color="#FF6B6B" />
              <Text style={styles.buttonWarningText}>Limpar Cache</Text>
            </TouchableOpacity>
          </View>

          {storageData.slice(0, 10).map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.storageItem}
              onPress={() => handleViewStorageItem(item)}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.storageItemKey} numberOfLines={1}>
                  {item.key}
                </Text>
                <Text style={styles.storageItemSize}>
                  {formatBytes(item.size)}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}

          {storageData.length > 10 && (
            <Text style={styles.moreItems}>
              + {storageData.length - 10} itens...
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flag" size={20} color={colors.accent} />
            <Text style={styles.sectionTitle}>Feature Flags</Text>
          </View>

          {featureFlags.map((flag) => (
            <View key={flag.id} style={styles.featureFlag}>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureFlagName}>{flag.name}</Text>
                <Text style={styles.featureFlagDesc}>{flag.description}</Text>
              </View>
              <Switch
                value={flag.enabled}
                onValueChange={() => toggleFeatureFlag(flag.id)}
                trackColor={{
                  false: colors.inputBackground,
                  true: colors.accent,
                }}
                thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={20} color={colors.accent} />
            <Text style={styles.sectionTitle}>Logs</Text>
            <TouchableOpacity
              onPress={handleExportLogs}
              style={styles.exportButton}
            >
              <Ionicons name="download" size={18} color={colors.accent} />
            </TouchableOpacity>
          </View>

          <View style={styles.logsContainer}>
            {logs.map((log, index) => (
              <Text key={index} style={styles.logItem}>
                {log}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="warning" size={20} color="#FF6B6B" />
            <Text style={[styles.sectionTitle, { color: "#FF6B6B" }]}>
              Danger Zone
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={handleClearAllData}
          >
            <Ionicons name="nuclear" size={18} color="#fff" />
            <Text style={styles.buttonDangerText}>Apagar Todos os Dados</Text>
          </TouchableOpacity>

          <Text style={styles.dangerWarning}>
            ⚠️ Esta ação é irreversível e apagará tudo!
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons
              name="information-circle"
              size={20}
              color={colors.accent}
            />
            <Text style={styles.sectionTitle}>App Info</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Versão:</Text>
            <Text style={styles.infoValue}>1.0.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Build:</Text>
            <Text style={styles.infoValue}>100</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tema:</Text>
            <Text style={styles.infoValue}>
              {theme === "dark" ? "Escuro" : "Claro"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Plataforma:</Text>
            <Text style={styles.infoValue}>React Native</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

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
      backgroundColor: colors.accent,
    },
    backButton: {
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
      color: "#fff",
    },
    content: {
      flex: 1,
    },
    section: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.textPrimary,
      flex: 1,
    },
    storageInfo: {
      padding: 12,
      backgroundColor: `${colors.accent}15`,
      borderRadius: 8,
      marginBottom: 12,
    },
    storageInfoText: {
      fontSize: 13,
      color: colors.accent,
      fontWeight: "600",
    },
    storageActions: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 12,
    },
    button: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      paddingVertical: 10,
      borderRadius: 8,
    },
    buttonSecondary: {
      backgroundColor: `${colors.accent}15`,
      borderWidth: 1,
      borderColor: colors.accent,
    },
    buttonSecondaryText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.accent,
    },
    buttonWarning: {
      backgroundColor: "#FF6B6B15",
      borderWidth: 1,
      borderColor: "#FF6B6B",
    },
    buttonWarningText: {
      fontSize: 13,
      fontWeight: "600",
      color: "#FF6B6B",
    },
    buttonDanger: {
      backgroundColor: "#FF6B6B",
    },
    buttonDangerText: {
      fontSize: 14,
      fontWeight: "700",
      color: "#fff",
    },
    storageItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    storageItemKey: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    storageItemSize: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    moreItems: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 12,
      fontStyle: "italic",
    },
    featureFlag: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    featureFlagName: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
      marginBottom: 4,
    },
    featureFlagDesc: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    logsContainer: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    logItem: {
      fontSize: 11,
      fontFamily: "monospace",
      color: colors.textSecondary,
      marginBottom: 4,
    },
    exportButton: {
      padding: 4,
    },
    dangerWarning: {
      fontSize: 12,
      color: "#FF6B6B",
      textAlign: "center",
      marginTop: 8,
      fontStyle: "italic",
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.glassBorder,
    },
    infoLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    infoValue: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.textPrimary,
    },
  });
