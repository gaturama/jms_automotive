import { Request, Response, NextFunction } from "express";
import { error } from "../utils/apiResponse";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.role !== "admin") {
    return error(res, "Acesso restrito a administradores", 403);
  }
  next();
};
