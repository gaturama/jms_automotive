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
import { userService } from "../service/user.service";

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

const getImageStorageKey = (userId: string) => `@CarShowroom:profileImages:${userId}`;

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
    if (currentUser?._id) {
      loadProfile();
    } else {
      setProfile(null);
    }
  }, [currentUser?._id]);

  const loadProfile = async () => {
    if (!currentUser) return;

    try {
      const remoteUser = await userService.getMe();

      const imageData = await AsyncStorage.getItem(getImageStorageKey(currentUser._id));
      const images = imageData ? JSON.parse(imageData) : { profileImage: null, coverImage: null };

      const loadedProfile: UserProfile = {
        bio: remoteUser.bio || "",
        location: remoteUser.location || "",
        favoritesBrand: remoteUser.favoritesBrand || "",
        showFavorites: remoteUser.showFavorites ?? true,
        showStats: remoteUser.showStats ?? true,
        profileUrl: remoteUser.profileUrl || `carshowroom.app/u/${currentUser._id}`,
        createdAt: remoteUser.createdAt || new Date().toISOString(),
        updatedAt: remoteUser.updatedAt || new Date().toISOString(),
        profileImage: images.profileImage,
        coverImage: images.coverImage,
      };

      setProfile(loadedProfile);
    } catch (error) {
      console.error("Erro ao carregar perfil:", error);
    }
  };

  const saveRemoteProfile = async (fields: Partial<UserProfile>) => {
    try {
      await userService.updateProfile(fields);
    } catch (error) {
      console.error("Erro ao salvar perfil no backend:", error);
      throw error;
    }
  };

  const saveLocalImages = async (images: { profileImage: string | null; coverImage: string | null }) => {
    if (!currentUser) return;
    await AsyncStorage.setItem(getImageStorageKey(currentUser._id), JSON.stringify(images));
  };

  const updateBio = async (bio: string) => {
    if (!profile) return;
    await saveRemoteProfile({ bio });
    setProfile({ ...profile, bio, updatedAt: new Date().toISOString() });
  };

  const updateLocation = async (location: string) => {
    if (!profile) return;
    await saveRemoteProfile({ location });
    setProfile({ ...profile, location, updatedAt: new Date().toISOString() });
  };

  const updateFavoritesBrand = async (brand: string) => {
    if (!profile) return;
    await saveRemoteProfile({ favoritesBrand: brand });
    setProfile({ ...profile, favoritesBrand: brand, updatedAt: new Date().toISOString() });
  };

  const toggleShowFavorites = async () => {
    if (!profile) return;
    const showFavorites = !profile.showFavorites;
    await saveRemoteProfile({ showFavorites });
    setProfile({ ...profile, showFavorites, updatedAt: new Date().toISOString() });
  };

  const toggleShowStats = async () => {
    if (!profile) return;
    const showStats = !profile.showStats;
    await saveRemoteProfile({ showStats });
    setProfile({ ...profile, showStats, updatedAt: new Date().toISOString() });
  };

  const updateProfileImage = async () => {
    if (!profile) return;

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
      const updatedImages = { profileImage: result.assets[0].uri, coverImage: profile.coverImage };
      await saveLocalImages(updatedImages);
      setProfile({ ...profile, profileImage: result.assets[0].uri, updatedAt: new Date().toISOString() });
    }
  };

  const updateCoverImage = async () => {
    if (!profile) return;

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
      const updatedImages = { profileImage: profile.profileImage, coverImage: result.assets[0].uri };
      await saveLocalImages(updatedImages);
      setProfile({ ...profile, coverImage: result.assets[0].uri, updatedAt: new Date().toISOString() });
    }
  };

  const removeProfileImage = async () => {
    if (!profile) return;
    const updatedImages = { profileImage: null, coverImage: profile.coverImage };
    await saveLocalImages(updatedImages);
    setProfile({ ...profile, profileImage: null, updatedAt: new Date().toISOString() });
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
    return fields.reduce((total, filled, i) => total + (filled ? weights[i] : 0), 0);
  };

  const isProfileComplete = (): boolean => getProfileCompletionPercentage() === 100;

  const reloadProfile = async () => {
    await loadProfile();
  };

  const resetProfile = async () => {
    if (!profile) return;
    await saveRemoteProfile({ bio: "", location: "", favoritesBrand: "", showFavorites: true, showStats: true });
    await saveLocalImages({ profileImage: null, coverImage: null });
    setProfile({
      ...profile,
      bio: "",
      profileImage: null,
      coverImage: null,
      location: "",
      favoritesBrand: "",
      showFavorites: true,
      showStats: true,
      updatedAt: new Date().toISOString(),
    });
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