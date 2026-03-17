import api from "./api";

export const favoriteService = {
  getFavorites: async () => {
    const { data } = await api.get("/favorites");
    return data.data;
  },

  addFavorite: async (carId: string) => {
    const { data } = await api.post(`/favorites/${carId}`);
    return data.data;
  },

  removeFavorite: async (carId: string) => {
    await api.delete(`/favorites/${carId}`);
  },
};
