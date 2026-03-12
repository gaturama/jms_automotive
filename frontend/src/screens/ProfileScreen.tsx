import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InputMasks } from "../utils/InputMasks";
import { useAuth } from "../context/AuthContext";
import { HapticFeedback } from "../utils/Haptics";
import { useTheme } from "../context/ThemeContext";
import CustomAlert from "../components/CustomAlert";
import { createStyles } from "../styles/stylesProfile";
import { ThemeToggle } from "../components/ThemeToggle";
import { RootStackParamList } from "../navigation/types";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { useUserProfile } from "../context/UserProfileContext";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SkeletonListItem, Skeleton } from "../components/SkeletonComponents";

type Props = NativeStackScreenProps<RootStackParamList, "Profile">;

export default function ProfileScreen({ navigation }: Props) {
  const { currentUser, updateUser, logout } = useAuth();
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(createStyles);

  const [name, setName] = useState(currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const [refreshing, setRefreshing] = useState(false);
  const { profile, getProfileCompletionPercentage } = useUserProfile();
  const completion = getProfileCompletionPercentage();
  const [devModeTaps, setDevModeTaps] = useState(0);

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
    loadProfileData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    await loadProfileData();

    setRefreshing(false);
  };

  const loadProfileData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsLoading(false);
  };

  const handlePhoneChange = (text: string) => {
    const formatted = InputMasks.formatPhone(text);
    setPhone(formatted);
    HapticFeedback.selection();
  };

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setPhone(currentUser.phone);
    }
  }, [currentUser]);

  const handleEdit = async () => {
    if (!name || !email || !phone) {
      HapticFeedback.error();
      setAlertTitle("Campos Incompletos");
      setAlertMessage("Por favor, preencha nome, email e telefone.");
      setAlertVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      const updateData: any = {
        name,
        email,
        phone,
      };

      if (password) {
        if (password.length < 4) {
          HapticFeedback.error();
          setAlertTitle("Senha Fraca");
          setAlertMessage("A senha deve ter no mínimo 4 caracteres.");
          setAlertVisible(true);
          setIsLoading(false);
          return;
        }
        updateData.password = password;
      }

      const result = await updateUser(updateData);

      if (result.success) {
        HapticFeedback.success();
        setAlertTitle("Sucesso!");
        setAlertMessage(result.message);
        setAlertVisible(true);
        setPassword("");
      } else {
        HapticFeedback.error();
        setAlertTitle("Erro");
        setAlertMessage(result.message);
        setAlertVisible(true);
      }
    } catch (error) {
      HapticFeedback.error();
      setAlertTitle("Erro");
      setAlertMessage("Ocorreu um erro ao atualizar. Tente novamente.");
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    HapticFeedback.warning();
    await logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
    });
  };

  const closeAlert = () => {
    setAlertVisible(false);
    setAlertTitle("");
    setAlertMessage("");
  };

  if (!currentUser) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={{ color: colors.textPrimary, fontSize: 18 }}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor="#DC143C" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meu Perfil</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.backgroundParticles}>
        <Animated.View style={[styles.particle, styles.particle1]} />
        <Animated.View style={[styles.particle, styles.particle2]} />
        <Animated.View style={[styles.particle, styles.particle3]} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
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
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {isLoading ? (
              <View>
                <View
                  style={[styles.avatarContainer, { alignItems: "center" }]}
                >
                  <Skeleton width={120} height={120} borderRadius={60} />
                </View>

                <View style={styles.glassCard}>
                  <View style={{ marginBottom: 20 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Skeleton width={40} height={40} borderRadius={20} />
                        <View style={{ marginLeft: 12 }}>
                          <Skeleton
                            width={100}
                            height={18}
                            borderRadius={4}
                            style={{ marginBottom: 6 }}
                          />
                          <Skeleton width={140} height={14} borderRadius={4} />
                        </View>
                      </View>
                      <Skeleton width={50} height={30} borderRadius={15} />
                    </View>
                  </View>

                  <View style={styles.divider} />

                  {[1, 2, 3, 4].map((i) => (
                    <View key={i} style={{ marginBottom: 20 }}>
                      <Skeleton
                        width={120}
                        height={16}
                        borderRadius={4}
                        style={{ marginBottom: 8 }}
                      />
                      <Skeleton width="100%" height={50} borderRadius={12} />
                    </View>
                  ))}

                  <Skeleton
                    width="100%"
                    height={54}
                    borderRadius={14}
                    style={{ marginBottom: 20 }}
                  />

                  <SkeletonListItem />
                  <SkeletonListItem />
                  <SkeletonListItem />

                  <Skeleton
                    width="100%"
                    height={50}
                    borderRadius={12}
                    style={{ marginTop: 16 }}
                  />
                </View>
              </View>
            ) : (
              <>
                <Animated.View
                  style={[
                    styles.avatarContainer,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => {
                      const newTaps = devModeTaps + 1;
                      setDevModeTaps(newTaps);

                      if (newTaps >= 3 && newTaps < 7) {
                        HapticFeedback.light();
                      }

                      if (newTaps === 7) {
                        HapticFeedback.success();
                        Alert.alert(
                          "🔓 Developer Mode",
                          "Developer Settings desbloqueado!\n\nAcesso a:\n• AsyncStorage\n• Feature Flags\n• Logs\n• Cache Management",
                          [
                            {
                              text: "Cancelar",
                              style: "cancel",
                              onPress: () => setDevModeTaps(0),
                            },
                            {
                              text: "Abrir",
                              onPress: () => {
                                navigation.navigate("DeveloperSettings");
                                setDevModeTaps(0);
                              },
                            },
                          ],
                        );
                      }
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.avatarGlass}>
                      <Text style={styles.avatarText}>
                        {name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.avatarEditButton}>
                    <Ionicons name="camera" size={18} color="#fff" />
                  </TouchableOpacity>
                </Animated.View>

                {devModeTaps > 0 && devModeTaps < 7 && (
                  <View
                    style={{
                      position: "absolute",
                      top: 200,
                      alignSelf: "center",
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      zIndex: 1000,
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {7 - devModeTaps} toques restantes...
                    </Text>
                  </View>
                )}

                <View style={styles.glassCard}>
                  <TouchableOpacity
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: `${colors.accent}10`,
                      borderRadius: 16,
                      padding: 16,
                      marginBottom: 20,
                      borderWidth: 1,
                      borderColor: `${colors.accent}30`,
                    }}
                    onPress={() => {
                      HapticFeedback.light();
                      navigation.navigate("PublicProfile");
                    }}
                    activeOpacity={0.8}
                  >
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: colors.accent,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      {profile?.profileImage ? (
                        <Image
                          source={{ uri: profile.profileImage }}
                          style={{ width: 50, height: 50, borderRadius: 25 }}
                        />
                      ) : (
                        <Text
                          style={{
                            fontSize: 20,
                            fontWeight: "700",
                            color: "#fff",
                          }}
                        >
                          {name.charAt(0).toUpperCase()}
                        </Text>
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "700",
                          color: colors.textPrimary,
                          marginBottom: 4,
                        }}
                      >
                        Meu Perfil Público
                      </Text>
                      <Text
                        style={{ fontSize: 12, color: colors.textSecondary }}
                      >
                        {profile?.bio || "Toque para personalizar seu perfil"}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                      }}
                    >
                      <View
                        style={{
                          backgroundColor:
                            completion === 100 ? "#4CAF50" : colors.accent,
                          paddingHorizontal: 10,
                          paddingVertical: 6,
                          borderRadius: 12,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: "700",
                            color: "#fff",
                          }}
                        >
                          {completion}%
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.accentLight}
                      />
                    </View>
                  </TouchableOpacity>
                  <View style={styles.divider} />

                  <View style={styles.themeSection}>
                    <View style={styles.themeSectionLeft}>
                      <Ionicons
                        name={isDark ? "moon" : "sunny"}
                        size={24}
                        color={colors.accent}
                      />
                      <View style={{ marginLeft: 12 }}>
                        <Text style={styles.themeSectionTitle}>
                          Tema {isDark ? "Escuro" : "Claro"}
                        </Text>
                        <Text style={styles.themeSectionSubtitle}>
                          {isDark
                            ? "Perfeito para a noite"
                            : "Perfeito para o dia"}
                        </Text>
                      </View>
                    </View>
                    <ThemeToggle />
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Nome Completo</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="person-outline"
                        size={20}
                        color={colors.textSecondary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        autoCorrect={false}
                        autoCapitalize="words"
                        placeholder="Seu nome"
                        placeholderTextColor={colors.placeholder}
                        value={name}
                        onChangeText={setName}
                        style={styles.input}
                        editable={!isLoading}
                      />
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Email</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color={colors.textSecondary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="seu@email.com"
                        placeholderTextColor={colors.placeholder}
                        value={email}
                        onChangeText={setEmail}
                        style={styles.input}
                        keyboardType="email-address"
                        editable={!isLoading}
                      />
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Telefone</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="call-outline"
                        size={20}
                        color={colors.textSecondary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="(00) 00000-0000"
                        placeholderTextColor={colors.placeholder}
                        value={phone}
                        onChangeText={handlePhoneChange}
                        style={styles.input}
                        keyboardType="phone-pad"
                        editable={!isLoading}
                      />
                    </View>
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Nova Senha (opcional)</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={colors.textSecondary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="*********"
                        placeholderTextColor={colors.placeholder}
                        value={password}
                        onChangeText={setPassword}
                        style={[styles.input, styles.passwordInput]}
                        secureTextEntry={!showPassword}
                        editable={!isLoading}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={styles.eyeIcon}
                        disabled={isLoading}
                      >
                        <Ionicons
                          name={
                            showPassword ? "eye-off-outline" : "eye-outline"
                          }
                          size={20}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.button, isLoading && { opacity: 0.7 }]}
                    onPress={handleEdit}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color="#fff"
                          style={{ marginRight: 8 }}
                        />
                        <Text style={styles.buttonText}>Salvar Alterações</Text>
                      </>
                    )}
                  </TouchableOpacity>
                  <View style={styles.optionsContainer}>
                    <TouchableOpacity style={styles.optionButton}>
                      <Ionicons
                        name="notifications-outline"
                        size={20}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.optionText}>Notificações</Text>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.textTertiary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton}>
                      <Ionicons
                        name="shield-checkmark-outline"
                        size={20}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.optionText}>Privacidade</Text>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.textTertiary}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionButton}>
                      <Ionicons
                        name="help-circle-outline"
                        size={20}
                        color={colors.textSecondary}
                      />
                      <Text style={styles.optionText}>Ajuda e Suporte</Text>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color={colors.textTertiary}
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                    disabled={isLoading}
                  >
                    <Ionicons
                      name="log-out-outline"
                      size={20}
                      color={colors.accent}
                    />
                    <Text style={styles.logoutText}>Sair da Conta</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlert
        isVisible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={closeAlert}
      />
    </View>
  );
}
