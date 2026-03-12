import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { TurbineRating } from "../components/Turbinerating";
import { ReviewsList } from "../components/Reviewlist";
import { ReviewModal } from "../components/ReviewModal";
import { useRatings } from "../context/RatingsContext";
import { useAuth } from "../context/AuthContext";
import { Car } from "../navigation/car";
import CustomAlert from "./CustomAlert";

interface RatingsSectionProps {
  car: Car;
}

export const RatingsSection: React.FC<RatingsSectionProps> = ({ car }) => {
  const { colors } = useTheme();
  const { currentUser } = useAuth();
  const {
    getCarReviews,
    getCarAverageRating,
    getUserReview,
    addReview,
    updateReview,
    deleteReview,
  } = useRatings();

  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const reviews = getCarReviews(car.id);
  const averageRating = getCarAverageRating(car.id);
  const userReview = getUserReview(car.id);

  const handleAddReview = () => {
    if (!currentUser) {
      setAlertTitle("Login Necessário");
      setAlertMessage("Você precisa estar logado para avaliar carros!");
      setAlertVisible(true);
      return;
    }
    setModalVisible(true);
  };

  const handleSubmitReview = async (rating: number, comment: string) => {
    if (userReview) {
      const result = await updateReview(userReview.id, rating, comment);
      setAlertTitle(result.success ? "Sucesso!" : "Erro");
      setAlertMessage(result.message);
      setAlertVisible(true);
    } else {
      const result = await addReview(car.id, rating, comment);
      setAlertTitle(result.success ? "Sucesso!" : "Erro");
      setAlertMessage(result.message);
      setAlertVisible(true);
    }
  };

  const handleEditReview = () => {
    setModalVisible(true);
  };

  const handleDeleteReview = async (reviewId: string) => {
    await deleteReview(reviewId);
    setAlertTitle("Sucesso!");
    setAlertMessage("Avaliação excluída com sucesso!");
    setAlertVisible(true);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();
  const totalReviews = reviews.length;

  return (
    <View style={styles(colors).container}>
      <View style={styles(colors).header}>
        <View style={styles(colors).averageContainer}>
          <Text style={styles(colors).averageNumber}>
            {averageRating > 0 ? averageRating.toFixed(1) : "0.0"}
          </Text>
          <TurbineRating rating={averageRating} readonly size={24} />
          <Text style={styles(colors).totalReviews}>
            {totalReviews} {totalReviews === 1 ? "avaliação" : "avaliações"}
          </Text>
        </View>

        <TouchableOpacity
          style={styles(colors).addButton}
          onPress={handleAddReview}
          activeOpacity={0.8}
        >
          <Ionicons
            name={userReview ? "pencil" : "add-circle"}
            size={20}
            color="#fff"
          />
          <Text style={styles(colors).addButtonText}>
            {userReview ? "Editar" : "Avaliar"}
          </Text>
        </TouchableOpacity>
      </View>

      {totalReviews > 0 && (
        <View style={styles(colors).distributionContainer}>
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = distribution[rating as keyof typeof distribution];
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

            return (
              <View key={rating} style={styles(colors).distributionRow}>
                <Text style={styles(colors).distributionLabel}>{rating}</Text>
                <Ionicons name="speedometer" size={14} color={colors.accent} />
                <View style={styles(colors).distributionBarContainer}>
                  <View
                    style={[
                      styles(colors).distributionBar,
                      { width: `${percentage}%` },
                    ]}
                  />
                </View>
                <Text style={styles(colors).distributionCount}>{count}</Text>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles(colors).reviewsContainer}>
        <Text style={styles(colors).reviewsTitle}>
          Avaliações ({totalReviews})
        </Text>
        <ReviewsList
          reviews={reviews}
          onEditReview={handleEditReview}
          onDeleteReview={handleDeleteReview}
        />
      </View>

      <ReviewModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitReview}
        carName={car.name}
        existingReview={userReview}
      />

      <CustomAlert
        isVisible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

const styles = (colors: any) => StyleSheet.create({
  container: {
    marginTop: 24,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.glassBackground,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: 16,
  },

  averageContainer: {
    flex: 1,
    gap: 8,
  },

  averageNumber: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.accent,
  },

  totalReviews: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "500",
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 6,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  addButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },

  distributionContainer: {
    backgroundColor: colors.glassBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: 16,
    gap: 8,
  },

  distributionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  distributionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.textPrimary,
    width: 12,
  },

  distributionBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: colors.inputBackground,
    borderRadius: 4,
    overflow: "hidden",
  },

  distributionBar: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 4,
  },

  distributionCount: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    width: 24,
    textAlign: "right",
  },

  reviewsContainer: {
    marginTop: 8,
  },

  reviewsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
  },
});