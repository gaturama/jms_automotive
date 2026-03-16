import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Car } from "../navigation/car";
import { historyService } from "../service/history.service";
import { useAuth } from "./AuthContext";

interface ViewHistoryItem {
  car: Car;
  viewedAt: string;
}

interface ViewHistoryContextData {
  viewHistory: ViewHistoryItem[];
  loadHistory: () => Promise<void>;
  addToHistory: (car: Car) => Promise<void>;
  clearHistory: () => Promise<void>;
  getLastViewed: () => ViewHistoryItem | null;
  getRecentlyViewed: (limit?: number) => ViewHistoryItem[];
}

const ViewHistoryContext = createContext<ViewHistoryContextData>(
  {} as ViewHistoryContextData,
);

interface ViewHistoryProviderProps {
  children: ReactNode;
}

export const ViewHistoryProvider: React.FC<ViewHistoryProviderProps> = ({
  children,
}) => {
  const [viewHistory, setViewHistory] = useState<ViewHistoryItem[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    } else {
      setViewHistory([]);
    }
  }, [isAuthenticated]);

  const loadHistory = async () => {
    try {
      const data = await historyService.getHistory();
      setViewHistory(data);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
    }
  };

  const addToHistory = async (car: Car) => {
    try {
      await historyService.addToHistory(car._id);
      setViewHistory((prev) => {
        const filtered = prev.filter((item) => item.car._id !== car._id);
        return [{ car, viewedAt: new Date().toISOString() }, ...filtered];
      });
    } catch (error) {
      console.error("Erro ao adicionar ao histórico:", error);
    }
  };

  const clearHistory = async () => {
    try {
      await historyService.clearHistory();
      setViewHistory([]);
    } catch (error) {
      console.error("Erro ao limpar histórico:", error);
    }
  };

  const getLastViewed = (): ViewHistoryItem | null => {
    return viewHistory.length > 0 ? viewHistory[0] : null;
  };

  const getRecentlyViewed = (limit: number = 10): ViewHistoryItem[] => {
    return viewHistory.slice(0, limit);
  };

  return (
    <ViewHistoryContext.Provider
      value={{
        viewHistory,
        loadHistory,
        addToHistory,
        clearHistory,
        getLastViewed,
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