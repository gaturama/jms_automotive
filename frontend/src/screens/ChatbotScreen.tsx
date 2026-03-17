import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Animated,
  StyleSheet,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HapticFeedback } from "../utils/Haptics";
import { useTheme } from "../context/ThemeContext";
import { Car } from "../navigation/car";
import { RootStackParamList } from "../navigation/types";
import { carService } from "../service/car.service";
import { ChatbotEngine, ChatMessage } from "../utils/ChatbotEngine";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<RootStackParamList, "Chatbot">;

export default function ChatbotScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const [cars, setCars] = useState<Car[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([
    ChatbotEngine.getWelcomeMessage(),
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const result = await carService.getCars({ limit: 100 });
      setCars(result.cars);
    } catch (error) {
      console.error("Erro ao carregar carros para o chatbot:", error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    HapticFeedback.light();

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    const botResponse = await ChatbotEngine.processMessage(
      inputText.trim(),
      cars,
    );

    setIsTyping(false);
    setMessages((prev) => [...prev, botResponse]);
    HapticFeedback.success();

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSuggestion = (suggestion: string) => {
    HapticFeedback.selection();
    setInputText(suggestion);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.sender === "user";

    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.botMessageContainer,
        ]}
      >
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Ionicons name="rocket" size={20} color="#fff" />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isUser
              ? { backgroundColor: colors.accent }
              : {
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.glassBorder,
                },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isUser ? "#fff" : colors.textPrimary },
            ]}
          >
            {item.text}
          </Text>

          {item.suggestions && item.suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {item.suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.suggestionChip,
                    {
                      backgroundColor: `${colors.accent}15`,
                      borderColor: colors.accent,
                    },
                  ]}
                  onPress={() => handleSuggestion(suggestion)}
                >
                  <Text
                    style={[
                      styles.suggestionText,
                      { color: colors.accentLight },
                    ]}
                  >
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {isUser && (
          <View
            style={[styles.avatar, { backgroundColor: colors.accentLight }]}
          >
            <Ionicons name="person" size={20} color="#fff" />
          </View>
        )}
      </Animated.View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={[styles.messageContainer, styles.botMessageContainer]}>
        <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
          <Ionicons name="rocket" size={20} color="#fff" />
        </View>
        <View
          style={[
            styles.typingBubble,
            {
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.glassBorder,
            },
          ]}
        >
          <View style={styles.typingDots}>
            <View
              style={[styles.dot, { backgroundColor: colors.textSecondary }]}
            />
            <View
              style={[styles.dot, { backgroundColor: colors.textSecondary }]}
            />
            <View
              style={[styles.dot, { backgroundColor: colors.textSecondary }]}
            />
          </View>
        </View>
      </View>
    );
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
          <View style={styles.headerAvatar}>
            <Ionicons name="rocket" size={24} color="#fff" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Assistente Virtual</Text>
            <Text style={styles.headerSubtitle}>
              {isTyping ? "Digitando..." : "Online"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            HapticFeedback.light();
            setMessages([ChatbotEngine.getWelcomeMessage()]);
          }}
          style={styles.clearButton}
        >
          <Ionicons name="refresh" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.messagesContainer, { opacity: fadeAnim }]}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderTypingIndicator}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
        />
      </Animated.View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: inputText.trim()
                  ? colors.accent
                  : colors.glassBorder,
                opacity: inputText.trim() ? 1 : 0.5,
              },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || isTyping}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim() ? "#fff" : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
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
      gap: 12,
      flex: 1,
    },
    headerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: { fontSize: 16, fontWeight: "700", color: "#fff" },
    headerSubtitle: { fontSize: 12, color: "rgba(255, 255, 255, 0.8)" },
    clearButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    messagesContainer: { flex: 1 },
    messagesList: { padding: 16 },
    messageContainer: {
      flexDirection: "row",
      marginBottom: 16,
      alignItems: "flex-end",
      gap: 8,
    },
    userMessageContainer: { justifyContent: "flex-end" },
    botMessageContainer: { justifyContent: "flex-start" },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    messageBubble: { maxWidth: "70%", padding: 12, borderRadius: 16 },
    messageText: { fontSize: 14, lineHeight: 20 },
    suggestionsContainer: { marginTop: 12, gap: 8 },
    suggestionChip: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      borderWidth: 1,
    },
    suggestionText: { fontSize: 13, fontWeight: "600" },
    typingBubble: { padding: 12, borderRadius: 16 },
    typingDots: { flexDirection: "row", gap: 6 },
    dot: { width: 8, height: 8, borderRadius: 4 },
    inputContainer: {
      flexDirection: "row",
      alignItems: "flex-end",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    input: {
      flex: 1,
      minHeight: 44,
      maxHeight: 100,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 22,
      fontSize: 14,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.glassBorder,
      color: colors.textPrimary,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
  });
