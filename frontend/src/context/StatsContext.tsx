import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "./AuthContext";
import { userService } from "../service/user.service";

interface UserStats {
  totalTimeInApp: number;
  lastSessionStart: string;
  sessionCount: number;
  totalCarViews: number;
  uniqueCarsViewed: string[];
  mostViewedCarId: string | null;
  viewsByCarId: Record<string, number>;
  totalFavorites: number;
  favoritesHistory: string[];
  totalComparisons: number;
  comparisonPairs: string[][];
  totalReviews: number;
  averageRatingGiven: number;
  reviewsByCarId: Record<string, number>;
  totalSearches: number;
  searchTerms: Record<string, number>;
  mostSearchedTerm: string | null;
  filtersUsed: Record<string, number>;
  mostUsedFilter: string | null;
  brandViews: Record<string, number>;
  favoriteBrand: string | null;
  shareCount: number;
  notificationsSent: number;
  firstAppOpen: string;
  lastAppOpen: string;
  achievements: string[];
}

interface StatsContextData {
  stats: UserStats;
  startSession: () => void;
  endSession: () => void;
  recordCarView: (carId: string) => Promise<void>;
  recordFavorite: (carId: string, isAdding: boolean) => Promise<void>;
  recordComparison: (car1Id: string, car2Id: string) => Promise<void>;
  recordReview: (carId: string, rating: number) => Promise<void>;
  recordSearch: (term: string) => Promise<void>;
  recordFilter: (filterType: string) => Promise<void>;
  recordShare: () => Promise<void>;
  checkAchievements: () => Promise<void>;
  resetStats: () => Promise<void>;
  getStatsReport: () => StatsReport;
}

interface StatsReport {
  totalTime: string;
  daysActive: number;
  averageSessionTime: string;
  mostViewedCar: { id: string; views: number } | null;
  favoriteBrand: { brand: string; views: number } | null;
  topSearches: { term: string; count: number }[];
  level: number;
  nextLevelProgress: number;
  achievements: Achievement[];
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
}

const STORAGE_KEY = "@CarShowroom:userStats";

const defaultStats: UserStats = {
  totalTimeInApp: 0,
  lastSessionStart: new Date().toISOString(),
  sessionCount: 0,
  totalCarViews: 0,
  uniqueCarsViewed: [],
  mostViewedCarId: null,
  viewsByCarId: {},
  totalFavorites: 0,
  favoritesHistory: [],
  totalComparisons: 0,
  comparisonPairs: [],
  totalReviews: 0,
  averageRatingGiven: 0,
  reviewsByCarId: {},
  totalSearches: 0,
  searchTerms: {},
  mostSearchedTerm: null,
  filtersUsed: {},
  mostUsedFilter: null,
  brandViews: {},
  favoriteBrand: null,
  shareCount: 0,
  notificationsSent: 0,
  firstAppOpen: new Date().toISOString(),
  lastAppOpen: new Date().toISOString(),
  achievements: [],
};

const StatsContext = createContext<StatsContextData>({} as StatsContextData);

interface StatsProviderProps {
  children: ReactNode;
}

export const StatsProvider: React.FC<StatsProviderProps> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(defaultStats);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadStats();
    startSession();
    return () => { endSession(); };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      syncWithBackend();
    }
  }, [isAuthenticated]);

  const syncWithBackend = async () => {
    try {
      const remoteStats = await userService.getStats();
      setStats((prev) => ({
        ...prev,
        totalFavorites: remoteStats.totalFavorites,
        totalReviews: remoteStats.totalReviews,
        totalCarViews: remoteStats.totalViews,
      }));
    } catch (error) {
      console.error("Erro ao sincronizar stats com backend:", error);
    }
  };

  const loadStats = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setStats(JSON.parse(saved));
      } else {
        await saveStats(defaultStats);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const saveStats = async (newStats: UserStats) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newStats));
      setStats(newStats);
    } catch (error) {
      console.error("Error saving stats:", error);
    }
  };

  const startSession = () => {
    const now = new Date();
    setSessionStartTime(now);
    const updatedStats = {
      ...stats,
      sessionCount: stats.sessionCount + 1,
      lastSessionStart: now.toISOString(),
      lastAppOpen: now.toISOString(),
    };
    saveStats(updatedStats);
  };

  const endSession = () => {
    if (!sessionStartTime) return;
    const now = new Date();
    const sessionDuration = Math.floor((now.getTime() - sessionStartTime.getTime()) / 1000);
    const updatedStats = { ...stats, totalTimeInApp: stats.totalTimeInApp + sessionDuration };
    saveStats(updatedStats);
  };

  const recordCarView = async (carId: string) => {
    const updatedViews = { ...stats.viewsByCarId };
    updatedViews[carId] = (updatedViews[carId] || 0) + 1;
    const uniqueViewed = stats.uniqueCarsViewed.includes(carId)
      ? stats.uniqueCarsViewed
      : [...stats.uniqueCarsViewed, carId];
    const mostViewed = Object.entries(updatedViews).reduce((a, b) => a[1] > b[1] ? a : b);
    const updatedStats = {
      ...stats,
      totalCarViews: stats.totalCarViews + 1,
      uniqueCarsViewed: uniqueViewed,
      mostViewedCarId: mostViewed[0],
      viewsByCarId: updatedViews,
    };
    await saveStats(updatedStats);
    await checkAchievements();
  };

  const recordFavorite = async (carId: string, isAdding: boolean) => {
    const updatedHistory = isAdding
      ? [...stats.favoritesHistory, carId]
      : stats.favoritesHistory.filter((id) => id !== carId);
    const updatedStats = {
      ...stats,
      totalFavorites: isAdding ? stats.totalFavorites + 1 : stats.totalFavorites - 1,
      favoritesHistory: updatedHistory,
    };
    await saveStats(updatedStats);
    await checkAchievements();
  };

  const recordComparison = async (car1Id: string, car2Id: string) => {
    const updatedStats = {
      ...stats,
      totalComparisons: stats.totalComparisons + 1,
      comparisonPairs: [...stats.comparisonPairs, [car1Id, car2Id]],
    };
    await saveStats(updatedStats);
    await checkAchievements();
  };

  const recordReview = async (carId: string, rating: number) => {
    const updatedReviews = { ...stats.reviewsByCarId };
    updatedReviews[carId] = (updatedReviews[carId] || 0) + 1;
    const totalRatings = stats.totalReviews + 1;
    const newAverage = (stats.averageRatingGiven * stats.totalReviews + rating) / totalRatings;
    const updatedStats = {
      ...stats,
      totalReviews: totalRatings,
      averageRatingGiven: newAverage,
      reviewsByCarId: updatedReviews,
    };
    await saveStats(updatedStats);
    await checkAchievements();
  };

  const recordSearch = async (term: string) => {
    if (!term.trim()) return;
    const normalizedTerm = term.toLowerCase().trim();
    const updatedTerms = { ...stats.searchTerms };
    updatedTerms[normalizedTerm] = (updatedTerms[normalizedTerm] || 0) + 1;
    const mostSearched = Object.entries(updatedTerms).reduce((a, b) => a[1] > b[1] ? a : b);
    const updatedStats = {
      ...stats,
      totalSearches: stats.totalSearches + 1,
      searchTerms: updatedTerms,
      mostSearchedTerm: mostSearched[0],
    };
    await saveStats(updatedStats);
  };

  const recordFilter = async (filterType: string) => {
    const updatedFilters = { ...stats.filtersUsed };
    updatedFilters[filterType] = (updatedFilters[filterType] || 0) + 1;
    const mostUsed = Object.entries(updatedFilters).reduce((a, b) => a[1] > b[1] ? a : b);
    const updatedStats = { ...stats, filtersUsed: updatedFilters, mostUsedFilter: mostUsed[0] };
    await saveStats(updatedStats);
  };

  const recordShare = async () => {
    const updatedStats = { ...stats, shareCount: stats.shareCount + 1 };
    await saveStats(updatedStats);
    await checkAchievements();
  };

  const checkAchievements = async () => {
    const newAchievements: string[] = [...stats.achievements];

    const checks: [boolean, string][] = [
      [stats.totalCarViews === 1, "first_view"],
      [stats.totalCarViews >= 10, "explorer"],
      [stats.totalCarViews >= 50, "enthusiast"],
      [stats.totalFavorites === 1, "first_favorite"],
      [stats.totalFavorites >= 5, "collector"],
      [stats.totalComparisons === 1, "analyst"],
      [stats.totalReviews === 1, "critic"],
      [stats.totalReviews >= 10, "super_critic"],
      [stats.totalTimeInApp >= 3600, "time_invested"],
      [stats.shareCount >= 5, "influencer"],
    ];

    checks.forEach(([condition, id]) => {
      if (condition && !newAchievements.includes(id)) {
        newAchievements.push(id);
      }
    });

    if (newAchievements.length > stats.achievements.length) {
      await saveStats({ ...stats, achievements: newAchievements });
    }
  };

  const getStatsReport = (): StatsReport => {
    const hours = Math.floor(stats.totalTimeInApp / 3600);
    const minutes = Math.floor((stats.totalTimeInApp % 3600) / 60);
    const totalTime = `${hours}h ${minutes}m`;

    const firstOpen = new Date(stats.firstAppOpen);
    const lastOpen = new Date(stats.lastAppOpen);
    const daysActive = Math.ceil((lastOpen.getTime() - firstOpen.getTime()) / (1000 * 60 * 60 * 24));

    const avgSessionSeconds = stats.sessionCount > 0 ? stats.totalTimeInApp / stats.sessionCount : 0;
    const averageSessionTime = `${Math.floor(avgSessionSeconds / 60)}m`;

    const mostViewedCar = stats.mostViewedCarId
      ? { id: stats.mostViewedCarId, views: stats.viewsByCarId[stats.mostViewedCarId] }
      : null;

    const favoriteBrand = stats.favoriteBrand
      ? { brand: stats.favoriteBrand, views: stats.brandViews[stats.favoriteBrand] }
      : null;

    const topSearches = Object.entries(stats.searchTerms)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([term, count]) => ({ term, count }));

    const xp =
      stats.totalCarViews * 10 +
      stats.totalFavorites * 50 +
      stats.totalComparisons * 30 +
      stats.totalReviews * 100 +
      stats.shareCount * 75;

    const level = Math.floor(xp / 1000) + 1;
    const nextLevelXP = level * 1000;
    const currentLevelXP = (level - 1) * 1000;
    const nextLevelProgress = Math.floor(((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100);

    const achievements = getAchievementsList().filter((a) => stats.achievements.includes(a.id));

    return { totalTime, daysActive, averageSessionTime, mostViewedCar, favoriteBrand, topSearches, level, nextLevelProgress, achievements };
  };

  const resetStats = async () => {
    await saveStats(defaultStats);
  };

  return (
    <StatsContext.Provider
      value={{
        stats,
        startSession,
        endSession,
        recordCarView,
        recordFavorite,
        recordComparison,
        recordReview,
        recordSearch,
        recordFilter,
        recordShare,
        checkAchievements,
        resetStats,
        getStatsReport,
      }}
    >
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => {
  const context = useContext(StatsContext);
  if (!context) {
    throw new Error("useStats must be used within StatsProvider");
  }
  return context;
};

export const getAchievementsList = (): Achievement[] => [
  { id: "first_view", title: "Primeira Olhada", description: "Visualizou seu primeiro carro", icon: "eye" },
  { id: "explorer", title: "Explorador", description: "Visualizou 10 carros", icon: "compass" },
  { id: "enthusiast", title: "Entusiasta", description: "Visualizou 50 carros", icon: "star" },
  { id: "first_favorite", title: "Primeiro Amor", description: "Adicionou seu primeiro favorito", icon: "heart" },
  { id: "collector", title: "Colecionador", description: "Tem 5 carros favoritos", icon: "albums" },
  { id: "analyst", title: "Analista", description: "Fez sua primeira comparação", icon: "git-compare" },
  { id: "critic", title: "Crítico", description: "Escreveu sua primeira avaliação", icon: "create" },
  { id: "super_critic", title: "Super Crítico", description: "Escreveu 10 avaliações", icon: "ribbon" },
  { id: "time_invested", title: "Tempo Bem Gasto", description: "Passou 1 hora no app", icon: "time" },
  { id: "influencer", title: "Influenciador", description: "Compartilhou 5 carros", icon: "share-social" },
];