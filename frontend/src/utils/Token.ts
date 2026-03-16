import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "@showroom:token";
const REFRESH_KEY = "@showroom:refresh";

export const saveToken = async (access: string, refresh: string) => {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, access],
    [REFRESH_KEY, refresh],
  ]);
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const getRefreshToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(REFRESH_KEY);
};

export const removeToken = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, REFRESH_KEY]);
};
