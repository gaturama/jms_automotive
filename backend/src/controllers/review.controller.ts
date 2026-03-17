import { Request, Response } from "express";
import Review from "../models/Review.model";
import { success, error } from "../utils/apiResponse";

export const getCarReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ car: req.params.carId }).populate(
      "user",
      "name avatar",
    );
    return success(res, reviews);
  } catch {
    return error(res, "Erro ao buscar avaliações", 500);
  }
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.create({
      user: req.user!._id,
      car: req.params.carId,
      ...req.body,
    });
    return success(res, review, 201);
  } catch (err: any) {
    if (err.code === 11000)
      return error(res, "Você já avaliou este carro", 409);
    return error(res, "Erro ao criar avaliação", 500);
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user!._id },
      req.body,
      { new: true, runValidators: true },
    );
    if (!review) return error(res, "Avaliação não encontrada", 404);
    return success(res, review);
  } catch {
    return error(res, "Erro ao atualizar avaliação", 500);
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findOneAndDelete({
      _id: req.params.id,
      user: req.user!._id,
    });
    if (!review) return error(res, "Avaliação não encontrada", 404);
    return success(res, { message: "Avaliação removida" });
  } catch {
    return error(res, "Erro ao remover avaliação", 500);
  }
};
