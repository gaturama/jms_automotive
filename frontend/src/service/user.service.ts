import api from "./api";

export const userService = {
  getPublicProfile: async (id: string) => {
    const { data } = await api.get(`/users/${id}/profile`);
    return data.data;
  },

  updateProfile: async (payload: {
    name?: string;
    bio?: string;
    avatar?: string;
    location?: string;
    favoritesBrand?: string;
    showFavorites?: boolean;
    showStats: boolean;
  }) => {
    const { data } = await api.put("/users/profile", payload);
    return data.data;
  },

  updateNotifications: async (enabled: boolean) => {
    const { data } = await api.put("/users/notifications", {
      notificationsEnabled: enabled,
    });
    return data.data;
  },

  getStats: async () => {
    const { data } = await api.get("/users/stats");
    return data.data;
  },

  getMe: async () => {
    const { data } = await api.get("/users/me");
    return data.data;
  },

  getUsers: async () => {
    const { data } = await api.get("/users/list");
    return data.data;
  },
};
