import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Car } from "../navigation/car";

interface ViewHistoryItem {
  car: Car;
  viewedAt: string;
  viewCount: number;
}

interface ViewHistoryContextData {
  viewHistory: ViewHistoryItem[];
  addToHistory: (car: Car) => Promise<void>;
  clearHistory: () => Promise<void>;
  removeFromHistory: (carId: string) => Promise<void>;
  getCarViewCount: (carId: string) => number;
  getLastViewed: () => ViewHistoryItem | null;
  getMostViewed: () => ViewHistoryItem[];
  getRecentlyViewed: (limit?: number) => ViewHistoryItem[];
}

const ViewHistoryContext = createContext<ViewHistoryContextData>(
  {} as ViewHistoryContextData,
);

const STORAGE_KEY = "@CarShowroom:viewHistory";
const MAX_HISTORY_ITEMS = 50;

interface ViewHistoryProviderProps {
  children: ReactNode;
}

export const ViewHistoryProvider: React.FC<ViewHistoryProviderProps> = ({
  children,
}) => {
  const [viewHistory, setViewHistory] = useState<ViewHistoryItem[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const historyData = await AsyncStorage.getItem(STORAGE_KEY);
      if (historyData) {
        setViewHistory(JSON.parse(historyData));
      }
    } catch (error) {
      console.error("Error to load view history:", error);
    }
  };

  const saveHistory = async (history: ViewHistoryItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
      setViewHistory(history);
    } catch (error) {
      console.error("Error to save view history:", error);
    }
  };

  const addToHistory = async (car: Car) => {
    try {
      const now = new Date().toISOString();
      const existingIndex = viewHistory.findIndex(
        (item) => item.car.id === car.id,
      );

      let updatedHistory: ViewHistoryItem[];

      if (existingIndex !== -1) {
        updatedHistory = [...viewHistory];
        updatedHistory[existingIndex] = {
          car,
          viewedAt: now,
          viewCount: updatedHistory[existingIndex].viewCount + 1,
        };

        const item = updatedHistory.splice(existingIndex, 1)[0];
        updatedHistory.unshift(item);
      } else {
        updatedHistory = [
          {
            car,
            viewedAt: now,
            viewCount: 1,
          },
          ...viewHistory,
        ];
      }

      if (updatedHistory.length > MAX_HISTORY_ITEMS) {
        updatedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);
      }

      await saveHistory(updatedHistory);
    } catch (error) {
      console.error("Error adding to history:", error);
    }
  };

  const removeFromHistory = async (carId: string) => {
    try {
      const updatedHistory = viewHistory.filter(
        (item) => item.car.id !== carId,
      );
      await saveHistory(updatedHistory);
    } catch (error) {
      console.error("Error removing from history:", error);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setViewHistory([]);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  const getCarViewCount = (carId: string): number => {
    const item = viewHistory.find((h) => h.car.id === carId);
    return item?.viewCount || 0;
  };

  const getLastViewed = (): ViewHistoryItem | null => {
    return viewHistory.length > 0 ? viewHistory[0] : null;
  };

  const getMostViewed = (): ViewHistoryItem[] => {
    return [...viewHistory]
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10);
  };

  const getRecentlyViewed = (limit: number = 10): ViewHistoryItem[] => {
    return viewHistory.slice(0, limit);
  };

  return (
    <ViewHistoryContext.Provider
      value={{
        viewHistory,
        addToHistory,
        clearHistory,
        removeFromHistory,
        getCarViewCount,
        getLastViewed,
        getMostViewed,
        getRecentlyViewed,
      }}
    >
      {children}
    </ViewHistoryContext.Provider>
  );
};

export const useViewHistory = () => {
  const context = useContext(ViewHistoryContext);
  if (!context) {
    throw new Error("useViewHistory must be used within ViewHistoryProvider");
  }
  return context;
};
