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

  createCar: async (payload: Record<string, unknown>) => {
    const { data } = await api.post("/cars", payload);
    return data.data;
  },

  updateCar: async (id: string, payload: Record<string, unknown>) => {
    const { data } = await api.put(`/cars/${id}`, payload);
    return data.data;
  },

  deleteCar: async (id: string) => {
    await api.delete(`/cars/${id}`);
  },
};
