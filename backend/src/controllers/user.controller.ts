import { Request, Response } from "express";
import User from "../models/User.model";
import Review from "../models/Review.model";
import Favorite from "../models/Favorite.model";
import History from "../models/History.model";
import { success, error } from "../utils/apiResponse";

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select(
      "name avatar bio createdAt",
    );
    if (!user) return error(res, "Usuário não encontrado", 404);
    return success(res, user);
  } catch {
    return error(res, "Erro ao buscar perfil", 500);
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, bio, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { name, bio, avatar },
      { new: true, runValidators: true },
    );
    return success(res, user);
  } catch {
    return error(res, "Erro ao atualizar perfil", 500);
  }
};

export const updateNotificationSettings = async (
  req: Request,
  res: Response,
) => {
  try {
    const { notificationsEnabled } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { notificationsEnabled },
      { new: true },
    );
    return success(res, user);
  } catch {
    return error(res, "Erro ao atualizar notificações", 500);
  }
};

export const getStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user!._id;

    const [totalFavorites, totalReviews, totalViews] = await Promise.all([
      Favorite.countDocuments({ user: userId }),
      Review.countDocuments({ user: userId }),
      History.countDocuments({ user: userId }),
    ]);

    return success(res, { totalFavorites, totalReviews, totalViews });
  } catch {
    return error(res, "Erro ao buscar estatísticas", 500);
  }
};

export const getMe = async (req: Request, res: Response) => {
  return success(res, req.user);
};
