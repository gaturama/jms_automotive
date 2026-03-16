import api from "./api";

export const historyService = {
  getHistory: async () => {
    const { data } = await api.get("/history");
    return data.data;
  },

  addToHistory: async (carId: string) => {
    await api.post(`/history/${carId}`);
  },

  clearHistory: async () => {
    await api.delete("/history");
  },
};
