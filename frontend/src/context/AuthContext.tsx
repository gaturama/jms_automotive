import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { authService } from "../service/auth.service";
import { userService } from "../service/user.service";
import { getToken, removeToken } from "../utils/Token";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  dateBirth?: string;
  avatar?: string;
  bio?: string;
  role: "user" | "admin";
  biometricEnabled: boolean;
  notificationEnabled: boolean;
}

interface AuthContextData {
  currentUser: User | null;
  isAuthenticated: boolean;
  register: (
    userData: { name: string; email: string; password: string }
  ) => Promise<{ success: boolean; message: string }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (
    userData: Partial<User>
  ) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const USERS_STORAGE_KEY = "@CarShowroom:users";
const CURRENT_USER_KEY = "@CarShowroom:currentUser";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (token) {
        const user = await userService.getMe();
        setCurrentUser(user);
      }
    } catch {
      await removeToken();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const user = await authService.register(
        userData.name,
        userData.email,
        userData.password,
      );
      setCurrentUser(user);
      return { success: true, message: `Bem-vindo, ${user.name}!` };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Erro ao cadastrar usuário. Tente novamente.";
      return { success: false, message };
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const user = await authService.login(email, password);
      setCurrentUser(user);
      return { success: true, message: `Bem-vindo de volta, ${user.name}!` };
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Email ou senha incorretos!";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const updateUser = async (
    userData: Partial<User>,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const updated = await userService.updateProfile(userData);
      setCurrentUser(updated);
      return { success: true, message: "Informações atualizadas com sucesso!" };
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Erro ao atualizar informações. Tente novamente.";
      return { success: false, message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        register,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
