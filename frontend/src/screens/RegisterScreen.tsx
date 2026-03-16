import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Animated,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { InputMasks } from "../utils/InputMasks";
import { HapticFeedback } from "../utils/Haptics";
import { useTheme } from "../context/ThemeContext";
import CustomAlert from "../components/CustomAlert";
import { createStyles } from "../styles/stylesRegister";
import { RootStackParamList } from "../navigation/types";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { Skeleton } from "../components/SkeletonComponents";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;

export default function RegisterScreen({ navigation }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [dateBirth, setDateBirth] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(false);

  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { register } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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

    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoadingInitial(false);
  };

  const handlePhoneChange = (text: string) => {
    const formatted = InputMasks.formatPhone(text);
    setPhone(formatted);
    HapticFeedback.selection();
  };

  const handleDateChange = (text: string) => {
    const formatted = InputMasks.formatDate(text);
    setDateBirth(formatted);
    HapticFeedback.selection();
  };

  const handleRegister = async () => {
    if (!name || !email || !phone || !password || !dateBirth) {
      setAlertTitle("Campos Incompletos");
      setAlertMessage("Por favor, preencha todos os campos.");
      setAlertVisible(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlertTitle("Email Inválido");
      setAlertMessage("Por favor, insira um email válido.");
      setAlertVisible(true);
      return;
    }

    if (!InputMasks.isValidPhone(phone)) {
      HapticFeedback.error();
      setAlertTitle("Telefone Inválido");
      setAlertMessage("Por favor, insira um telefone válido com DDD.");
      setAlertVisible(true);
      return;
    }

    if (!InputMasks.isValidDate(dateBirth)) {
      HapticFeedback.error();
      setAlertTitle("Data Inválida");
      setAlertMessage("Por favor, insira uma data de nascimento válida.");
      setAlertVisible(true);
      return;
    }

    if (password.length < 4) {
      setAlertTitle("Senha Fraca");
      setAlertMessage("A senha deve ter no mínimo 4 caracteres.");
      setAlertVisible(true);
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({
        name,
        email,
        password,
        phone: InputMasks.unformatPhone(phone),
        dateBirth,
      });

      if (result.success) {
        setAlertTitle("Sucesso!");
        setAlertMessage(result.message);
        setAlertVisible(true);

        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }, 2000);
      } else {
        setAlertTitle("Erro no Cadastro");
        setAlertMessage(result.message);
        setAlertVisible(true);
      }
    } catch (error) {
      setAlertTitle("Erro");
      setAlertMessage("Ocorreu um erro ao cadastrar. Tente novamente.");
      setAlertVisible(true);
    } finally {
      setIsLoading(false);
    }
  };

  const closeAlert = () => {
    setAlertVisible(false);
    setAlertTitle("");
    setAlertMessage("");
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.accentLight}
      />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          disabled={isLoading}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Criar Conta</Text>
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
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Bem-vindo!</Text>
              <Text style={styles.subtitle}>
                Preencha seus dados para começar
              </Text>
            </View>

            <View style={styles.glassCard}>
              {isLoadingInitial ? (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <View key={i} style={{ marginBottom: 20 }}>
                      <Skeleton
                        width={140}
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
                    style={{ marginBottom: 16 }}
                  />

                  <Skeleton
                    width={150}
                    height={16}
                    borderRadius={4}
                    style={{ alignSelf: "center" }}
                  />
                </>
              ) : (
                <>
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
                        placeholderTextColor={colors.textSecondary}
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
                        placeholderTextColor={colors.textSecondary}
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
                        placeholderTextColor={colors.textSecondary}
                        value={phone}
                        onChangeText={handlePhoneChange}
                        style={styles.input}
                        keyboardType="phone-pad"
                        editable={!isLoading}
                      />
                    </View>
                    {phone.length > 0 && !InputMasks.isValidPhone(phone) && (
                      <Text style={styles.errorHint}>
                        Digite o DDD e o número completo
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Data de Nascimento</Text>
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={colors.textSecondary}
                        style={styles.inputIcon}
                      />
                      <TextInput
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder="DD/MM/AAAA"
                        placeholderTextColor={colors.textSecondary}
                        value={dateBirth}
                        onChangeText={handleDateChange}
                        style={styles.input}
                        keyboardType="numeric"
                        editable={!isLoading}
                        maxLength={10}
                      />
                    </View>
                    {dateBirth.length > 0 && !InputMasks.isValidDate(dateBirth) && (
                      <Text style={styles.errorHint}>
                        Data inválida (DD/MM/AAAA)
                      </Text>
                    )}
                  </View>

                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Senha</Text>
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
                        placeholder="••••••••"
                        placeholderTextColor={colors.textSecondary}
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
                          color="rgba(255, 255, 255, 0.6)"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={[styles.button, isLoading && { opacity: 0.7 }]}
                    onPress={handleRegister}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator
                        color={colors.textPrimary}
                        size="small"
                      />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>Criar Conta</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                    style={styles.loginLink}
                    disabled={isLoading}
                  >
                    <Text style={styles.textLogin}>
                      Já tem conta?{" "}
                      <Text style={styles.textLoginStrong}>Entrar</Text>
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
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
