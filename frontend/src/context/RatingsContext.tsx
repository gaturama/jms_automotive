import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export interface Review {
  id: string;
  carId: string;
  userId: string;
  userName: string;
  rating: number; 
  comment: string;
  date: string;
}

interface RatingsContextData {
  reviews: Review[];
  addReview: (carId: string, rating: number, comment: string) => Promise<{ success: boolean; message: string }>;
  getCarReviews: (carId: string) => Review[];
  getCarAverageRating: (carId: string) => number;
  getUserReview: (carId: string) => Review | undefined;
  deleteReview: (reviewId: string) => Promise<void>;
  updateReview: (reviewId: string, rating: number, comment: string) => Promise<{ success: boolean; message: string }>;
}

const RatingsContext = createContext<RatingsContextData>({} as RatingsContextData);

const REVIEWS_STORAGE_KEY = '@CarShowroom:reviews';

interface RatingsProviderProps {
  children: ReactNode;
}

export const RatingsProvider: React.FC<RatingsProviderProps> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const reviewsData = await AsyncStorage.getItem(REVIEWS_STORAGE_KEY);
      if (reviewsData) {
        setReviews(JSON.parse(reviewsData));
      }
    } catch (error) {
      console.error('Erro ao carregar avaliações:', error);
    }
  };

  const saveReviews = async (newReviews: Review[]) => {
    try {
      await AsyncStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(newReviews));
      setReviews(newReviews);
    } catch (error) {
      console.error('Erro ao salvar avaliações:', error);
      throw error;
    }
  };

  const addReview = async (
    carId: string,
    rating: number,
    comment: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (!currentUser) {
        return {
          success: false,
          message: 'Você precisa estar logado para avaliar!',
        };
      }

      if (rating < 1 || rating > 5) {
        return {
          success: false,
          message: 'Avaliação deve ser entre 1 e 5 turbinas!',
        };
      }

      if (!comment.trim()) {
        return {
          success: false,
          message: 'Por favor, escreva um comentário!',
        };
      }

      const existingReview = reviews.find(
        (r) => r.carId === carId && r.userId === currentUser.id
      );

      if (existingReview) {
        return {
          success: false,
          message: 'Você já avaliou este carro! Edite sua avaliação existente.',
        };
      }

      const newReview: Review = {
        id: Date.now().toString(),
        carId,
        userId: currentUser.id,
        userName: currentUser.name,
        rating,
        comment: comment.trim(),
        date: new Date().toISOString(),
      };

      const updatedReviews = [...reviews, newReview];
      await saveReviews(updatedReviews);

      return {
        success: true,
        message: 'Avaliação enviada com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao enviar avaliação. Tente novamente.',
      };
    }
  };

  const updateReview = async (
    reviewId: string,
    rating: number,
    comment: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (rating < 1 || rating > 5) {
        return {
          success: false,
          message: 'Avaliação deve ser entre 1 e 5 turbinas!',
        };
      }

      if (!comment.trim()) {
        return {
          success: false,
          message: 'Por favor, escreva um comentário!',
        };
      }

      const updatedReviews = reviews.map((review) =>
        review.id === reviewId
          ? { ...review, rating, comment: comment.trim(), date: new Date().toISOString() }
          : review
      );

      await saveReviews(updatedReviews);

      return {
        success: true,
        message: 'Avaliação atualizada com sucesso!',
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro ao atualizar avaliação. Tente novamente.',
      };
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const updatedReviews = reviews.filter((review) => review.id !== reviewId);
      await saveReviews(updatedReviews);
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
    }
  };

  const getCarReviews = (carId: string): Review[] => {
    return reviews
      .filter((review) => review.carId === carId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  const getCarAverageRating = (carId: string): number => {
    const carReviews = reviews.filter((review) => review.carId === carId);
    if (carReviews.length === 0) return 0;

    const sum = carReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / carReviews.length;
  };

  const getUserReview = (carId: string): Review | undefined => {
    if (!currentUser) return undefined;
    return reviews.find(
      (review) => review.carId === carId && review.userId === currentUser.id
    );
  };

  return (
    <RatingsContext.Provider
      value={{
        reviews,
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
    throw new Error('useRatings must be used within a RatingsProvider');
  }
  return context;
};