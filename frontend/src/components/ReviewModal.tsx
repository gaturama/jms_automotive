import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { TurbineRating } from "../components/Turbinerating";
import { Review } from "../context/RatingsContext";

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  carName: string;
  existingReview?: Review;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  onClose,
  onSubmit,
  carName,
  existingReview,
}) => {
  const { colors } = useTheme();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setComment(existingReview.comment);
    } else {
      setRating(0);
      setComment("");
    }
  }, [existingReview, visible]);

  const handleSubmit = async () => {
    if (rating === 0) {
      return;
    }

    if (!comment.trim()) {
      return;
    }

    setIsLoading(true);
    await onSubmit(rating, comment);
    setIsLoading(false);
    handleClose();
  };

  const handleClose = () => {
    setRating(existingReview?.rating || 0);
    setComment(existingReview?.comment || "");
    onClose();
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return "Muito Fraco 😞";
      case 2:
        return "Fraco 😐";
      case 3:
        return "Regular 🙂";
      case 4:
        return "Bom 😊";
      case 5:
        return "Excelente! 🤩";
      default:
        return "Selecione uma avaliação";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles(colors).overlay}
      >
        <View style={styles(colors).modalContainer}>
          <View style={styles(colors).header}>
            <Text style={styles(colors).headerTitle}>
              {existingReview ? "Editar Avaliação" : "Avaliar Carro"}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles(colors).closeButton}>
              <Ionicons name="close" size={28} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles(colors).content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles(colors).carNameContainer}>
              <Ionicons name="car-sport" size={24} color={colors.accent} />
              <Text style={styles(colors).carName}>{carName}</Text>
            </View>

            <View style={styles(colors).section}>
              <Text style={styles(colors).sectionTitle}>Sua Avaliação</Text>
              <View style={styles(colors).ratingContainer}>
                <TurbineRating
                  rating={rating}
                  onRatingChange={setRating}
                  size={40}
                  showHalf={false}
                />
              </View>
              <Text style={styles(colors).ratingText}>{getRatingText()}</Text>
            </View>

            <View style={styles(colors).section}>
              <Text style={styles(colors).sectionTitle}>
                Comentário
                <Text style={styles(colors).required}> *</Text>
              </Text>
              <TextInput
                style={styles(colors).commentInput}
                placeholder="Compartilhe sua experiência com este carro..."
                placeholderTextColor={colors.placeholder}
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={6}
                maxLength={500}
                textAlignVertical="top"
              />
              <Text style={styles(colors).characterCount}>
                {comment.length}/500 caracteres
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles(colors).submitButton,
                (rating === 0 || !comment.trim() || isLoading) && styles(colors).submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={rating === 0 || !comment.trim() || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={22} color="#fff" />
                  <Text style={styles(colors).submitButtonText}>
                    {existingReview ? "Atualizar Avaliação" : "Enviar Avaliação"}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    maxHeight: "90%",
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.inputBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  carNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: colors.glassBackground,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },

  carName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },

  section: {
    marginTop: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
  },

  required: {
    color: colors.accent,
  },

  ratingContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: colors.glassBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },

  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.accent,
    textAlign: "center",
    marginTop: 12,
  },

  commentInput: {
    backgroundColor: colors.inputBackground,
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    minHeight: 140,
  },

  characterCount: {
    fontSize: 12,
    color: colors.textTertiary,
    textAlign: "right",
    marginTop: 8,
  },

  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginTop: 24,
    marginBottom: 32,
    gap: 8,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  submitButtonDisabled: {
    opacity: 0.5,
  },

  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: 0.5,
  },
});