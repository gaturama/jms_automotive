import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "./AuthContext";

/**
 * Sistema de Perfil Público do Usuário
 *
 * Gerencia:
 * - Bio/Descrição
 * - Foto de perfil
 * - Favoritos públicos
 * - Estatísticas públicas
 * - Privacidade
 *
 * IMPORTANTE: Nome, email e phone vêm do AuthContext
 */

interface UserProfile {
  bio: string;
  profileImage: string | null;
  coverImage: string | null;

  location: string;
  favoritesBrand: string;

  showFavorites: boolean;
  showStats: boolean;

  profileUrl: string;

  createdAt: string;
  updatedAt: string;
}

interface UserProfileContextData {
  profile: UserProfile | null;

  updateBio: (bio: string) => Promise<void>;
  updateProfileImage: () => Promise<void>;
  updateCoverImage: () => Promise<void>;
  removeProfileImage: () => Promise<void>;
  updateLocation: (location: string) => Promise<void>;
  updateFavoritesBrand: (brand: string) => Promise<void>;

  toggleShowFavorites: () => Promise<void>;
  toggleShowStats: () => Promise<void>;

  getProfileCompletionPercentage: () => number;
  isProfileComplete: () => boolean;
  reloadProfile: () => Promise<void>;

  resetProfile: () => Promise<void>;
}

const getStorageKey = (userEmail: string): string => {
  return `@CarShowroom:userProfile:${userEmail}`;
};

const UserProfileContext = createContext<UserProfileContextData>(
  {} as UserProfileContextData,
);

interface UserProfileProviderProps {
  children: ReactNode;
}

export const UserProfileProvider: React.FC<UserProfileProviderProps> = ({
  children,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser?.email) {
      console.log('Usuário mudou, carregando perfil para:', currentUser.email);
      loadProfile();
    }
  }, [currentUser?.email]);

  const loadProfile = async () => {
    if(!currentUser?.email) {
      console.log('Sem usuário logado, não carregar perfil');
      return;
    }

    const STORAGE_KEY = getStorageKey(currentUser.email);

    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        console.log("Perfil carregado:", currentUser.email, ":", parsed);
      } else {
        const initialProfile: UserProfile = {
          bio: "",
          profileImage: null,
          coverImage: null,
          location: "",
          favoritesBrand: "",
          showFavorites: true,
          showStats: true,
          profileUrl: generateProfileUrl(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await saveProfile(initialProfile);
        console.log("Perfil inicial criado");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const saveProfile = async (updatedProfile: UserProfile) => {
    if (!currentUser?.email) {
      console.log('Sem usuário logado, não salvar perfil');
      return;
    }

    const STORAGE_KEY = getStorageKey(currentUser.email);

    try {
      updatedProfile.updatedAt = new Date().toISOString();
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
      console.log("Perfil salvo:", updatedProfile);
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const generateProfileUrl = (): string => {
    return `carshowroom.app/u/${Math.random().toString(36).substr(2, 9)}`;
  };

  const updateBio = async (bio: string) => {
    if (!profile) {
      console.error("Profile não existe");
      return;
    }

    console.log("Atualizando bio para:", bio);

    const updatedProfile = {
      ...profile,
      bio,
    };

    await saveProfile(updatedProfile);
    console.log("Bio atualizada no profile");
  };

  const updateProfileImage = async () => {
    if (!profile) {
      console.error("Profile não existe");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Precisamos de permissão para acessar suas fotos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      console.log("Atualizando foto de perfil");

      const updatedProfile = {
        ...profile,
        profileImage: result.assets[0].uri,
      };

      await saveProfile(updatedProfile);
      console.log("Foto de perfil atualizada");
    }
  };

  const updateCoverImage = async () => {
    if (!profile) {
      console.error("Profile não existe");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Precisamos de permissão para acessar suas fotos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      console.log("Atualizando foto de capa");

      const updatedProfile = {
        ...profile,
        coverImage: result.assets[0].uri,
      };

      await saveProfile(updatedProfile);
      console.log("Foto de capa atualizada");
    }
  };

  const removeProfileImage = async () => {
    if (!profile) {
      console.error("Profile não existe");
      return;
    }

    console.log("Removendo foto de perfil");

    const updatedProfile = {
      ...profile,
      profileImage: null,
    };

    await saveProfile(updatedProfile);
    console.log("Foto de perfil removida");
  };

  const updateLocation = async (location: string) => {
    if (!profile) {
      console.error("Profile não existe");
      return;
    }

    console.log("Atualizando localização para:", location);

    const updatedProfile = {
      ...profile,
      location,
    };

    await saveProfile(updatedProfile);
    console.log("Localização atualizada no profile");
  };

  const updateFavoritesBrand = async (brand: string) => {
    if (!profile) {
      console.error("Profile não existe");
      return;
    }

    console.log("Atualizando marca favorita para:", brand);

    const updatedProfile = {
      ...profile,
      favoritesBrand: brand,
    };

    await saveProfile(updatedProfile);
    console.log("Marca favorita atualizada no profile");
  };

  const toggleShowFavorites = async () => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      showFavorites: !profile.showFavorites,
    };

    await saveProfile(updatedProfile);
  };

  const toggleShowStats = async () => {
    if (!profile) return;

    const updatedProfile = {
      ...profile,
      showStats: !profile.showStats,
    };

    await saveProfile(updatedProfile);
  };

  const getProfileCompletionPercentage = (): number => {
    if (!profile || !currentUser) return 0;

    const fields = [
      currentUser.name !== "",
      profile.bio !== "",
      profile.profileImage !== null,
      profile.location !== "",
      profile.favoritesBrand !== "",
      profile.coverImage !== null,
    ];

    const weights = [15, 15, 20, 15, 15, 20];
    let total = 0;

    fields.forEach((field, index) => {
      if (field) {
        total += weights[index];
      }
    });

    return total;
  };

  const isProfileComplete = (): boolean => {
    return getProfileCompletionPercentage() === 100;
  };

  const reloadProfile = async () => {
    console.log("Recarregando perfil...");
    await loadProfile();
  };

  const resetProfile = async () => {
    if (!profile) return;

    const resetProfile: UserProfile = {
      ...profile,
      bio: "",
      profileImage: null,
      coverImage: null,
      location: "",
      favoritesBrand: "",
      showFavorites: true,
      showStats: true,
    };

    await saveProfile(resetProfile);
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile,
        updateBio,
        updateProfileImage,
        updateCoverImage,
        removeProfileImage,
        updateLocation,
        updateFavoritesBrand,
        toggleShowFavorites,
        toggleShowStats,
        getProfileCompletionPercentage,
        isProfileComplete,
        reloadProfile,
        resetProfile,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUserProfile must be used within UserProfileProvider");
  }
  return context;
};
