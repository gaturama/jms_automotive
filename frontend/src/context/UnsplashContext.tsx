import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { searchCarImagesOptimized, UnsplashImage } from '../service/UnsplashService';

interface CarImages {
  carId: string;
  images: UnsplashImage[];
  lastFetched: string;
}

interface UnsplashContextData {
  getCarImages: (carId: string, carQuery: any) => Promise<UnsplashImage[]>;
  isLoading: boolean;
  refreshCarImages: (carId: string, carQuery: any) => Promise<void>;
  clearCache: () => Promise<void>;
}

const UnsplashContext = createContext<UnsplashContextData>({} as UnsplashContextData);

const STORAGE_KEY = '@CarShowroom:unsplashImages';
const CACHE_DURATION = 24 * 60 * 60 * 1000; 

interface UnsplashProviderProps {
  children: ReactNode;
}

export const UnsplashProvider: React.FC<UnsplashProviderProps> = ({ children }) => {
  const [imagesCache, setImagesCache] = useState<Record<string, CarImages>>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadCache();
  }, []);

  const loadCache = async () => {
    try {
      const cached = await AsyncStorage.getItem(STORAGE_KEY);
      if (cached) {
        setImagesCache(JSON.parse(cached));
      }
    } catch (error) {
      console.error('Error loading image cache:', error);
    }
  };

  const saveCache = async (cache: Record<string, CarImages>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
      setImagesCache(cache);
    } catch (error) {
      console.error('Error saving image cache:', error);
    }
  };

  const isCacheValid = (lastFetched: string): boolean => {
    const fetchedTime = new Date(lastFetched).getTime();
    const now = Date.now();
    return now - fetchedTime < CACHE_DURATION;
  };

  const getCarImages = async (carId: string, carQuery: any): Promise<UnsplashImage[]> => {
    const cached = imagesCache[carId];
    if (cached && isCacheValid(cached.lastFetched)) {
      return cached.images;
    }

    setIsLoading(true);

    try {
      const images = await searchCarImagesOptimized(carQuery);

      if (images.length > 0) {
        const newCache = {
          ...imagesCache,
          [carId]: {
            carId,
            images,
            lastFetched: new Date().toISOString(),
          },
        };

        await saveCache(newCache);
        return images;
      }

      return cached?.images || [];
    } catch (error) {
      console.error('Error fetching car images:', error);
      return cached?.images || [];
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCarImages = async (carId: string, carQuery: any): Promise<void> => {
    setIsLoading(true);

    try {
      const images = await searchCarImagesOptimized(carQuery);

      const newCache = {
        ...imagesCache,
        [carId]: {
          carId,
          images,
          lastFetched: new Date().toISOString(),
        },
      };

      await saveCache(newCache);
    } catch (error) {
      console.error('Error refreshing images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCache = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setImagesCache({});
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  return (
    <UnsplashContext.Provider
      value={{
        getCarImages,
        isLoading,
        refreshCarImages,
        clearCache,
      }}
    >
      {children}
    </UnsplashContext.Provider>
  );
};

export const useUnsplash = () => {
  const context = useContext(UnsplashContext);
  if (!context) {
    throw new Error('useUnsplash must be used within UnsplashProvider');
  }
  return context;
};