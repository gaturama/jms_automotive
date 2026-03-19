import React, { useCallback, useState, useRef } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  StatusBar,
  ActivityIndicator,
  Easing,
  Alert,
} from "react-native";
import { getToken } from "../utils/Token";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { HapticFeedback } from "../utils/Haptics";
import { useTheme } from "../context/ThemeContext";
import CustomAlert from "../components/CustomAlert";
import { createStyles } from "../styles/stylesLogin";
import { RootStackParamList } from "../navigation/types";
import { useFocusEffect } from "@react-navigation/native";
import { useThemedStyles } from "../hooks/useThemedStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BiometricAuthService } from "../service/BiometricAuthService";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "Login">;

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState("");
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { login } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(50)).current;
  const cardScale = useRef(new Animated.Value(0.9)).current;
  const emailSlide = useRef(new Animated.Value(30)).current;
  const passwordSlide = useRef(new Animated.Value(30)).current;
  const buttonSlide = useRef(new Animated.Value(30)).current;
  const particle1Float = useRef(new Animated.Value(0)).current;
  const particle2Float = useRef(new Animated.Value(0)).current;
  const particle3Float = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const biometricScale = useRef(new Animated.Value(1)).current;

  useFocusEffect(
    useCallback(() => {
      setEmail("");
      setPassword("");

      fadeAnim.setValue(0);
      logoScale.setValue(0.3);
      logoRotate.setValue(0);
      cardSlide.setValue(50);
      cardScale.setValue(0.9);
      emailSlide.setValue(30);
      passwordSlide.setValue(30);
      buttonSlide.setValue(30);

      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.parallel([
          Animated.spring(logoScale, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          Animated.timing(logoRotate, {
            toValue: 1,
            duration: 800,
            easing: Easing.out(Easing.back(1.2)),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.spring(cardSlide, {
            toValue: 0,
            tension: 40,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(cardScale, {
            toValue: 1,
            tension: 40,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
        Animated.stagger(100, [
          Animated.spring(emailSlide, {
            toValue: 0,
            tension: 40,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(passwordSlide, {
            toValue: 0,
            tension: 40,
            friction: 8,
            useNativeDriver: true,
          }),
          Animated.spring(buttonSlide, {
            toValue: 0,
            tension: 40,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(particle1Float, {
            toValue: -15,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particle1Float, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(particle2Float, {
            toValue: -20,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particle2Float, {
            toValue: 0,
            duration: 4000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(particle3Float, {
            toValue: -10,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(particle3Float, {
            toValue: 0,
            duration: 2500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      checkBiometricAvailability();
    }, []),
  );

  const checkBiometricAvailability = async () => {
    const available = await BiometricAuthService.isAvailable();
    setBiometricAvailable(available);

    if (available) {
      const type = await BiometricAuthService.getBiometricType();
      setBiometricType(type);

      const enabled = await BiometricAuthService.isBiometricLoginEnabled();
      setBiometricEnabled(enabled);

      if (enabled) {
        const userEmail = await BiometricAuthService.getBiometricUserEmail();
        if (userEmail) setEmail(userEmail);
      }
    }
  };

  const handleBiometricLogin = async () => {
    HapticFeedback.medium();

    Animated.sequence([
      Animated.timing(biometricScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(biometricScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const userEmail = await BiometricAuthService.getBiometricUserEmail();

      if (!userEmail) {
        Alert.alert(
          "Atenção",
          "Nenhuma conta configurada com biometria. Faça login com email e senha primeiro.",
        );
        return;
      }

      setIsLoading(true);

      const result = await BiometricAuthService.authenticate(
        `Entrar como ${userEmail}`,
      );

      if (result.success) {
        HapticFeedback.success();

        const token = await getToken();

        if (token) {
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.spring(cardScale, { toValue: 0.8, useNativeDriver: true }),
          ]).start(() => {
            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
          });
        } else {
          Alert.alert(
            "Sessão Expirada",
            "Sua sessão expirou. Por favor, faça login com email e senha uma vez.",
            [{ text: "OK", onPress: () => setEmail(userEmail) }],
          );
        }
      } else {
        HapticFeedback.error();
      }
    } catch (error) {
      HapticFeedback.error();
      Alert.alert("Erro", "Não foi possível fazer login com biometria.");
    } finally {
      setIsLoading(false);
    }
  };

  const shakeCard = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, { toValue: 1, useNativeDriver: true }).start();
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async () => {
    if (!email || !password) {
      HapticFeedback.error();
      setAlertTitle("Campos Incompletos");
      setAlertMessage("Por favor, preencha email e senha.");
      setAlertVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        HapticFeedback.success();

        if (biometricAvailable && !biometricEnabled) {
          setTimeout(() => {
            Alert.alert(
              `Habilitar ${biometricType}?`,
              `Use ${biometricType} para fazer login mais rápido na próxima vez.`,
              [
                { text: "Agora não", style: "cancel" },
                {
                  text: "Habilitar",
                  onPress: async () => {
                    const enabled =
                      await BiometricAuthService.enableBiometricLogin(email);
                    if (enabled) {
                      await savePassword(email, password);
                      Alert.alert(`${biometricType} habilitado com sucesso!`);
                    }
                  },
                },
              ],
            );
          }, 500);
        }

        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(cardScale, { toValue: 0.8, useNativeDriver: true }),
        ]).start(() => {
          navigation.reset({ index: 0, routes: [{ name: "Home" }] });
        });
      } else {
        HapticFeedback.error();
        setAlertTitle("Erro de Login");
        setAlertMessage(result.message);
        setAlertVisible(true);
        shakeCard();
      }
    } catch (error) {
      HapticFeedback.error();
      setAlertTitle("Erro");
      setAlertMessage("Ocorreu um erro ao fazer login. Tente novamente.");
      setAlertVisible(true);
      shakeCard();
    } finally {
      setIsLoading(false);
    }
  };

  const savePassword = async (
    email: string,
    password: string,
  ): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        `@CarShowroom:savedPassword:${email}`,
        password,
      );
    } catch (error) {
      console.error("Erro ao salvar senha:", error);
    }
  };

  const getSavedPassword = async (email: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(`@CarShowroom:savedPassword:${email}`);
    } catch {
      return null;
    }
  };

  const handleRegister = () => navigation.navigate("Register");

  const closeAlert = () => {
    setAlertVisible(false);
    setAlertTitle("");
    setAlertMessage("");
  };

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.background}
      />

      <View style={styles.backgroundParticles}>
        <Animated.View
          style={[
            styles.particle,
            styles.particle1,
            { transform: [{ translateY: particle1Float }] },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle2,
            { transform: [{ translateY: particle2Float }] },
          ]}
        />
        <Animated.View
          style={[
            styles.particle,
            styles.particle3,
            { transform: [{ translateY: particle3Float }] },
          ]}
        />
      </View>

      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: logoScale },
                { rotate: logoRotateInterpolate },
              ],
            },
          ]}
        >
          <Image
            source={
              isDark
                ? require("../assets/jms_logo.png")
                : require("../assets/jms_logo_black.png")
            }
            style={styles.image}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.glassCard,
            {
              transform: [
                { translateY: cardSlide },
                { scale: cardScale },
                { translateX: shakeAnim },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.inputContainer,
              { transform: [{ translateY: emailSlide }] },
            ]}
          >
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              autoCorrect={false}
              autoCapitalize="none"
              placeholder="seu@email.com"
              placeholderTextColor={colors.placeholder}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              editable={!isLoading}
            />
          </Animated.View>

          <Animated.View
            style={[
              styles.inputContainer,
              { transform: [{ translateY: passwordSlide }] },
            ]}
          >
            <Text style={styles.inputLabel}>Senha</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                autoCorrect={false}
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                style={[styles.input, styles.passwordInput]}
                editable={!isLoading}
              />
              <TouchableOpacity
                onPress={toggleShowPassword}
                style={styles.eyeIcon}
                disabled={isLoading}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={24}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </TouchableOpacity>
            </View>
          </Animated.View>

          <Animated.View
            style={{
              transform: [{ translateY: buttonSlide }, { scale: buttonScale }],
            }}
          >
            <TouchableOpacity
              style={[styles.button, isLoading && { opacity: 0.7 }]}
              onPress={handleLogin}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.9}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          {biometricAvailable && biometricEnabled && (
            <Animated.View
              style={{ transform: [{ scale: biometricScale }], marginTop: 12 }}
            >
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    backgroundColor: "transparent",
                    borderWidth: 1,
                    borderColor: colors.accent,
                  },
                ]}
                onPress={handleBiometricLogin}
                disabled={isLoading}
              >
                <Ionicons name="finger-print" size={22} color={colors.accent} />
                <Text
                  style={[
                    styles.buttonText,
                    { color: colors.accent, marginLeft: 8 },
                  ]}
                >
                  Entrar com {biometricType}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            onPress={handleRegister}
            style={styles.registerLink}
            disabled={isLoading}
          >
            <Text style={styles.textCadastro}>
              Não tem conta?{" "}
              <Text style={styles.textCadastroStrong}>Cadastre-se</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.footerText}>JMS Car Showroom © 2026</Text>
      </Animated.View>

      <CustomAlert
        isVisible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={closeAlert}
      />
    </View>
  );
}
