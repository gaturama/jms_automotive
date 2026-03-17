import { Request, Response } from "express";
import Favorite from "../models/Favorite.model";
import { success, error } from "../utils/apiResponse";
import mongoose from "mongoose";

export const getFavorites = async (req: Request, res: Response) => {
  try {
    const favorites = await Favorite.find({ user: req.user!._id }).populate("car");
    return success(res, favorites);
  } catch {
    return error(res, "Erro ao buscar favoritos", 500);
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const favorite = await Favorite.create({
      user: new mongoose.Types.ObjectId(String(req.user!._id)),
      car:  new mongoose.Types.ObjectId(String(req.params.carId)),
    });
    return success(res, favorite, 201);
  } catch (err: any) {
    if (err.code === 11000) return error(res, "Carro já está nos favoritos", 409);
    return error(res, "Erro ao adicionar favorito", 500);
  }
};

export const removeFavorite = async (req: Request, res: Response) => {
  try {
    await Favorite.findOneAndDelete({
      user: new mongoose.Types.ObjectId(String(req.user!._id)),
      car:  new mongoose.Types.ObjectId(String(req.params.carId)),
    });
    return success(res, { message: "Removido dos favoritos" });
  } catch {
    return error(res, "Erro ao remover favorito", 500);
  }
};