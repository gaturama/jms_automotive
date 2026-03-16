import { Request, Response } from "express";
import History from "../models/History.model";
import { success, error } from "../utils/apiResponse";

export const getHistory = async (req: Request, res: Response) => {
  try {
    const history = await History.find({ user: req.user!._id })
      .populate("car")
      .sort({ viewedAt: -1 })
      .limit(50);
    return success(res, history);
  } catch {
    return error(res, "Erro ao buscar histórico", 500);
  }
};

export const addToHistory = async (req: Request, res: Response) => {
  try {
    const entry = await History.findOneAndUpdate(
      { user: req.user!._id, car: req.params.carId },
      { viewedAt: new Date() },
      { upsert: true, new: true },
    );
    return success(res, entry, 201);
  } catch {
    return error(res, "Erro ao registrar histórico", 500);
  }
};

export const clearHistory = async (req: Request, res: Response) => {
  try {
    await History.deleteMany({ user: req.user!._id });
    return success(res, { message: "Histórico limpo" });
  } catch {
    return error(res, "Erro ao limpar histórico", 500);
  }
};
