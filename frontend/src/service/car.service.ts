import api from "./api";

export const carService = {
  getCars: async (params?: Record<string, unknown>) => {
    const { data } = await api.get("/cars", { params });
    return data.data;
  },

  getCarById: async (id: string) => {
    const { data } = await api(`/cars/${id}`);
    return data.data;
  },

  compareCars: async (ids: string[]) => {
    const { data } = await api.get("/cars/compare", {
      params: { ids: ids.join(",") },
    });
    return data.data;
  },
};
