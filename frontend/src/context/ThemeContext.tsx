import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "dark" | "light";

interface ThemeColors {
  background: string;
  surface: string;
  surfaceVariant: string;

  glassBackground: string;
  glassBorder: string;

  particleColor: string;
  particleColorSecondary: string;

  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  accent: string;
  accentLight: string;

  statusBarStyle: "light-content" | "dark-content";

  inputBackground: string;
  inputBorder: string;
  placeholder: string;

  cardBackground: string;
  cardBorder: string;

  shadowColor: string;
}

interface ThemeContextData {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

const THEME_STORAGE_KEY = "@CarShowroom:theme";

const darkColors: ThemeColors = {
  background: "#0A1413",
  surface: "#152422",
  surfaceVariant: "#1E293B",

  glassBackground: "rgba(255, 255, 255, 0.05)",
  glassBorder: "rgba(255, 255, 255, 0.1)",

  particleColor: "#0F766E",
  particleColorSecondary: "#2DD4BF",

  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textTertiary: "rgba(255, 255, 255, 0.5)",

  accent: "#0F766E",
  accentLight: "#2DD4BF",

  statusBarStyle: "light-content",

  inputBackground: "rgba(255, 255, 255, 0.08)",
  inputBorder: "rgba(255, 255, 255, 0.15)",
  placeholder: "rgba(255, 255, 255, 0.4)",

  cardBackground: "rgba(255, 255, 255, 0.05)",
  cardBorder: "rgba(255, 255, 255, 0.1)",

  shadowColor: "#000000",
};

const lightColors: ThemeColors = {
  background: "#F5F5F5",
  surface: "#FFFFFF",
  surfaceVariant: "#E8E8E8",

  glassBackground: "rgba(255, 255, 255, 0.9)",
  glassBorder: "rgba(0, 0, 0, 0.1)",

  particleColor: "#0F766E",
  particleColorSecondary: "#2DD4BF",

  textPrimary: "#1A1A1A",
  textSecondary: "rgba(0, 0, 0, 0.7)",
  textTertiary: "rgba(0, 0, 0, 0.5)",

  accent: "#0F766E",
  accentLight: "#2DD4BF",

  statusBarStyle: "dark-content",

  inputBackground: "rgba(0, 0, 0, 0.05)",
  inputBorder: "rgba(0, 0, 0, 0.1)",
  placeholder: "rgba(0, 0, 0, 0.4)",

  cardBackground: "#FFFFFF",
  cardBorder: "rgba(0, 0, 0, 0.1)",

  shadowColor: "#000000",
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error("Erro ao carregar tema:", error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme: Theme = theme === "dark" ? "light" : "dark";
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }
  };

  const colors = theme === "dark" ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors,
        toggleTheme,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};