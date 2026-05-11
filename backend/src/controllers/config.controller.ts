import { Request, Response } from "express";
import Config from "../models/Config.model";
import { success, error } from "../utils/apiResponse";

export const getConfig = async (req: Request, res: Response) => {
  try {
    let config = await Config.findOne();
    if (!config) config = await Config.create({});
    return success(res, config);
  } catch {
    return error(res, "Erro ao obter configuração", 500);
  }
};

export const updateConfig = async (req: Request, res: Response) => {
  try {
    const { spotifyPlaylistUrl, spotifyPlaylistName } = req.body;
    let config = await Config.findOne();
    if (!config) {
      config = await Config.create({ spotifyPlaylistUrl, spotifyPlaylistName });
    } else {
      config.spotifyPlaylistUrl = spotifyPlaylistUrl;
      config.spotifyPlaylistName = spotifyPlaylistName;
      await config.save();
    }
    return success(res, config);
  } catch {
    return error(res, "Erro ao atualizar configurações", 500);
  }
};
