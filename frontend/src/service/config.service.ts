import api from "./api";

export const configService = {
  getConfig: async () => {
    const { data } = await api.get("/config");
    return data.data;
  },

  updateConfig: async (payload: {
    spotifyPlaylistUrl: string;
    spotifyPlaylistName: string;
  }) => {
    const { data } = await api.put("/config", payload);
    return data.data;
  },
};
