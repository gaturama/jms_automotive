import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { reviewService } from "../service/review.service";

export interface Review {
  _id: string;
  car: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface RatingsContextData {
  reviews: Review[];
  loadCarReviews: (carId: string) => Promise<void>;
  addReview: (
    carId: string,
    rating: number,
    comment: string,
  ) => Promise<{ success: boolean; message: string }>;
  getCarReviews: (carId: string) => Review[];
  getCarAverageRating: (carId: string) => number;
  getUserReview: (carId: string) => Review | undefined;
  deleteReview: (reviewId: string) => Promise<void>;
  updateReview: (
    reviewId: string,
    rating: number,
    comment: string,
  ) => Promise<{ success: boolean; message: string }>;
}

const RatingsContext = createContext<RatingsContextData>(
  {} as RatingsContextData,
);

interface RatingsProviderProps {
  children: ReactNode;
}

export const RatingsProvider: React.FC<RatingsProviderProps> = ({
  children,
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { currentUser } = useAuth();

  const loadCarReviews = async (carId: string) => {
    try {
      const data = await reviewService.getCarReviews(carId);
      setReviews((prev) => [...prev.filter((r) => r.car !== carId), ...data]);
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
    }
  };

  const addReview = async (
    carId: string,
    rating: number,
    comment: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (!currentUser) {
        return {
          success: false,
          message: "Você precisa estar logado para avaliar!",
        };
      }

      if (rating < 1 || rating > 5) {
        return {
          success: false,
          message: "Avaliação deve ser entre 1 e 5 turbinas!",
        };
      }

      if (!comment.trim()) {
        return { success: false, message: "Por favor, escreva um comentário!" };
      }

      const newReview = await reviewService.createReview(
        carId,
        rating,
        comment.trim(),
      );
      setReviews((prev) => [newReview, ...prev]);

      return { success: true, message: "Avaliação enviada com sucesso!" };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Erro ao enviar avaliação. Tente novamente.";
      return { success: false, message };
    }
  };

  const updateReview = async (
    reviewId: string,
    rating: number,
    comment: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (rating < 1 || rating > 5) {
        return {
          success: false,
          message: "Avaliação deve ser entre 1 e 5 turbinas!",
        };
      }

      if (!comment.trim()) {
        return { success: false, message: "Por favor, escreva um comentário!" };
      }

      const updated = await reviewService.updateReview(
        reviewId,
        rating,
        comment.trim(),
      );
      setReviews((prev) => prev.map((r) => (r._id === reviewId ? updated : r)));

      return { success: true, message: "Avaliação atualizada com sucesso!" };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Erro ao atualizar avaliação. Tente novamente.";
      return { success: false, message };
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      await reviewService.deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (error) {
      console.error("Erro ao deletar avaliação:", error);
    }
  };

  const getCarReviews = (carId: string): Review[] => {
    return reviews
      .filter((r) => r.car === carId || (r as any).carId === carId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  };

  const getCarAverageRating = (carId: string): number => {
    const carReviews = reviews.filter((r) => r.car === carId);
    if (carReviews.length === 0) return 0;
    const sum = carReviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / carReviews.length;
  };

  const getUserReview = (carId: string): Review | undefined => {
    if (!currentUser) return undefined;
    return reviews.find(
      (r) =>
        (r.car === carId || (r as any).carId === carId) &&
        r.user._id === currentUser._id,
    );
  };

  return (
    <RatingsContext.Provider
      value={{
        reviews,
        loadCarReviews,
        addReview,
        getCarReviews,
        getCarAverageRating,
        getUserReview,
        deleteReview,
        updateReview,
      }}
    >
      {children}
    </RatingsContext.Provider>
  );
};

export const useRatings = () => {
  const context = useContext(RatingsContext);
  if (!context) {
    throw new Error("useRatings must be used within a RatingsProvider");
  }
  return context;
};
