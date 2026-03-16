import api from "./api";
import { saveToken, removeToken } from "../utils/Token";

export const authService = {
  register: async (name: string, email: string, password: string) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
    });
    await saveToken(data.data.accessToken, data.data.refreshToken);
    return data.data.user;
  },

  login: async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    await saveToken(data.data.accessToken, data.data.refreshToken);
    return data.data.user;
  },

  logout: async () => {
    await removeToken();
  },
};
