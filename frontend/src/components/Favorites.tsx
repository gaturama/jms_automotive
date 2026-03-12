import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Car } from '../navigation/car';

interface FavoritesData {
    favorites: Car[];
    addFavorite: (car: Car) => void;
    removeFavorite: (carId: string) => void;
    isFavorite: (carId: string) => boolean;
    toggleFavorite: (car: Car) => void;
}

const Favorites = createContext<FavoritesData>({} as FavoritesData);

interface FavoritesProviderProps {
    children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
    const [favorites, setFavorites] = useState<Car[]>([]);

    const addFavorite = (car: Car) => {
        setFavorites((prev) => {
            if (prev.find((c) => c.id === car.id)) {
                return prev;
            }
            return [...prev, car];
        });
    };

    const removeFavorite = (carId: string) => {
        setFavorites((prev) => prev.filter((car) => car.id !== carId));
    };

    const isFavorite = (carId: string): boolean => {
        return favorites.some((car) => car.id === carId);
    };

    const toggleFavorite = (car: Car) => {
        if (isFavorite(car.id)) {
            removeFavorite(car.id);
        } else {
            addFavorite(car);
        }
    };

    return (
        <Favorites.Provider
            value={{
                favorites,
                addFavorite,
                removeFavorite,
                isFavorite,
                toggleFavorite
            }}
        >
            {children}
        </Favorites.Provider>
    );
};

export const useFavorites = () => {
    const context = useContext(Favorites);
    if(!context) {
        throw new Error("useFavorites must be used within a FavoritesProvider");
    }
    return context;
};