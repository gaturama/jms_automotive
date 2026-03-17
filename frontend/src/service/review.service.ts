import api from "./api";

export const reviewService = {
  getCarReviews: async (carId: string) => {
    const { data } = await api.get(`/reviews/car/${carId}`);
    return data.data;
  },

  createReview: async (carId: string, rating: number, comment: string) => {
    const { data } = await api.post(`/reviews/${carId}`, { rating, comment });
    return data.data;
  },

  updateReview: async (id: string, rating: number, comment: string) => {
    const { data } = await api.put(`/reviews/${id}`, { rating, comment });
    return data.data;
  },

  deleteReview: async (id: string) => {
    await api.delete(`/reviews/${id}`);
  },
};
