import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Car } from '../navigation/car';
import { favoriteService } from '../service/favorite.service';
import { useAuth } from '../context/AuthContext';

interface FavoritesData {
  favorites: Car[];
  loading: boolean;
  loadFavorites: () => Promise<void>;
  addFavorite: (car: Car) => Promise<void>;
  removeFavorite: (carId: string) => Promise<void>;
  isFavorite: (carId: string) => boolean;
  toggleFavorite: (car: Car) => Promise<void>;
}

const Favorites = createContext<FavoritesData>({} as FavoritesData);

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const data = await favoriteService.getFavorites();
      // O backend retorna { car, ... }, então extrai só o car
      setFavorites(data.map((item: any) => item.car));
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (car: Car) => {
    try {
      await favoriteService.addFavorite(car._id);
      setFavorites((prev) => {
        if (prev.find((c) => c._id === car._id)) return prev;
        return [...prev, car];
      });
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
    }
  };

  const removeFavorite = async (carId: string) => {
    try {
      await favoriteService.removeFavorite(carId);
      setFavorites((prev) => prev.filter((car) => car._id !== carId));
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
    }
  };

  const isFavorite = (carId: string): boolean => {
    return favorites.some((car) => car._id === carId);
  };

  const toggleFavorite = async (car: Car) => {
    if (isFavorite(car._id)) {
      await removeFavorite(car._id);
    } else {
      await addFavorite(car);
    }
  };

  return (
    <Favorites.Provider
      value={{
        favorites,
        loading,
        loadFavorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </Favorites.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(Favorites);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};