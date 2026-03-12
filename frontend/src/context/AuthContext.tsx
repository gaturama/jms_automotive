import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  dateBirth?: string;
}

interface AuthContextData {
  users: User[];
  currentUser: User | null;
  isAuthenticated: boolean;
  register: (
    userData: Omit<User, "id">,
  ) => Promise<{ success: boolean; message: string }>;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateUser: (
    userData: Partial<User>,
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
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      setLoading(true);

      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      if (usersData) {
        setUsers(JSON.parse(usersData));
      }

      const currentUserData = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (currentUserData) {
        setCurrentUser(JSON.parse(currentUserData));
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveUsers = async (newUsers: User[]) => {
    try {
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
      setUsers(newUsers);
    } catch (error) {
      console.error("Erro ao salvar usuários:", error);
      throw error;
    }
  };

  const saveCurrentUser = async (user: User | null) => {
    try {
      if (user) {
        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
      }
      setCurrentUser(user);
    } catch (error) {
      console.error("Error ao salvar usuário atual:", error);
      throw error;
    }
  };

  const register = async (
    userData: Omit<User, "id">,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const emailExists = users.find(
        (u) => u.email.toLowerCase() === userData.email.toLowerCase(),
      );

      if (emailExists) {
        return {
          success: false,
          message: "Este email já está cadastrado!",
        };
      }

      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
      };

      const updatedUsers = [...users, newUser];
      await saveUsers(updatedUsers);
      await saveCurrentUser(newUser);

      return {
        success: true,
        message: `Bem-vindo, ${newUser.name}!`,
      };
    } catch (error) {
      return {
        success: false,
        message: "Erro ao cadastrar usuário. Tente novamente.",
      };
    }
  };

  const login = async (
    email: string,
    password: string,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );

      if (!user) {
        return {
          success: false,
          message: "Email ou senha incorretos!",
        };
      }

      await saveCurrentUser(user);

      return {
        success: true,
        message: `Bem-vindo de volta, ${user.name}!`,
      };
    } catch (error) {
      return {
        success: false,
        message: "Erro ao fazer login. Tente novamente.",
      };
    }
  };

  const logout = async () => {
    try {
      await saveCurrentUser(null);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const updateUser = async (
    userData: Partial<User>,
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (!currentUser) {
        return {
          success: false,
          message: "Nenhum usuário logado!",
        };
      }

      const updatedUser: User = {
        ...currentUser,
        ...userData,
        id: currentUser.id,
      };

      const updatedUsers = users.map((u) =>
        u.id === currentUser.id ? updatedUser : u,
      );

      await saveUsers(updatedUsers);
      await saveCurrentUser(updatedUser);

      return {
        success: true,
        message: "Informações atualizadas com sucesso!",
      };
    } catch (error) {
      return {
        success: false,
        message: "Erro ao atualizar informações. Tente novamente.",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        users,
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
