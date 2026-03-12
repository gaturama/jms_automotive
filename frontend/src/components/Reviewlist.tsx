import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { TurbineRating } from "../components/Turbinerating";
import { Review } from "../context/RatingsContext";
import { useAuth } from "../context/AuthContext";

interface ReviewsListProps {
  reviews: Review[];
  onEditReview?: (review: Review) => void;
  onDeleteReview?: (reviewId: string) => void;
}

export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  onEditReview,
  onDeleteReview,
}) => {
  const { colors } = useTheme();
  const { currentUser } = useAuth();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Hoje";
    } else if (diffInDays === 1) {
      return "Ontem";
    } else if (diffInDays < 7) {
      return `${diffInDays} dias atrás`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} ${weeks === 1 ? "semana" : "semanas"} atrás`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} ${months === 1 ? "mês" : "meses"} atrás`;
    } else {
      return date.toLocaleDateString("pt-BR");
    }
  };

  const handleDelete = (reviewId: string, userName: string) => {
    Alert.alert(
      "Excluir Avaliação",
      `Tem certeza que deseja excluir sua avaliação?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => onDeleteReview?.(reviewId),
        },
      ]
    );
  };

  const renderReview = ({ item }: { item: Review }) => {
    const isUserReview = currentUser?.id === item.userId;

    return (
      <View style={styles(colors).reviewCard}>
        <View style={styles(colors).reviewHeader}>
          <View style={styles(colors).userInfo}>
            <View style={styles(colors).avatar}>
              <Text style={styles(colors).avatarText}>
                {item.userName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={styles(colors).userDetails}>
              <Text style={styles(colors).userName}>
                {item.userName}
                {isUserReview && (
                  <Text style={styles(colors).youBadge}> (Você)</Text>
                )}
              </Text>
              <Text style={styles(colors).reviewDate}>
                {formatDate(item.date)}
              </Text>
            </View>
          </View>

          {isUserReview && (
            <View style={styles(colors).actions}>
              <TouchableOpacity
                onPress={() => onEditReview?.(item)}
                style={styles(colors).actionButton}
              >
                <Ionicons name="pencil" size={18} color={colors.accent} />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id, item.userName)}
                style={styles(colors).actionButton}
              >
                <Ionicons name="trash" size={18} color={colors.accent} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles(colors).ratingSection}>
          <TurbineRating rating={item.rating} readonly size={22} showHalf={false} />
        </View>

        <Text style={styles(colors).comment}>{item.comment}</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles(colors).emptyState}>
      <Ionicons name="chatbubbles-outline" size={60} color={colors.textTertiary} />
      <Text style={styles(colors).emptyTitle}>Nenhuma avaliação ainda</Text>
      <Text style={styles(colors).emptyText}>
        Seja o primeiro a avaliar este carro!
      </Text>
    </View>
  );

  if (reviews.length === 0) {
    return renderEmpty();
  }

  return (
    <View>
      {reviews.map((item) => (
        <View key={item.id}>
          {renderReview({ item })}
        </View>
      ))}
    </View>
  );
};

const styles = (colors: any) => StyleSheet.create({
  reviewCard: {
    backgroundColor: colors.glassBackground,
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },

  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  userDetails: {
    flex: 1,
  },

  userName: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 2,
  },

  youBadge: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.accent,
  },

  reviewDate: {
    fontSize: 12,
    color: colors.textTertiary,
    fontWeight: "500",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.inputBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  ratingSection: {
    marginBottom: 12,
  },

  comment: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  emptyContainer: {
    flex: 1,
  },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
});