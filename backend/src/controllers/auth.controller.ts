import { Request, Response } from "express";
import User from "../models/User.model";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../utils/jwt";
import { success, error } from "../utils/apiResponse";

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return error(res, "E-mail já cadastrado", 409);

    const user = await User.create({ name, email, password });
    const accessToken = generateAccessToken(String(user._id), user.role);
    const refreshToken = generateRefreshToken(String(user._id));

    return success(res, { user, accessToken, refreshToken }, 201);
  } catch (err) {
    return error(res, "Erro ao registrar usuário", 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return error(res, "Credenciais inválidas", 401);

    const valid = await user.comparePassword(password);
    if (!valid) return error(res, "Credenciais inválidas", 401);

    const accessToken = generateAccessToken(String(user._id), user.role);
    const refreshToken = generateRefreshToken(String(user._id));

    return success(res, { user, accessToken, refreshToken });
  } catch (err) {
    return error(res, "Erro ao realizar login", 500);
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return error(res, "Refresh token não fornecido", 400);

    const decoded = verifyToken(
      token,
      process.env.JWT_REFRESH_SECRET as string,
    ) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) return error(res, "Usuário não encontrado", 401);

    const accessToken = generateAccessToken(String(user._id), user.role);
    return success(res, { accessToken });
  } catch {
    return error(res, "Refresh token inválido ou expirado", 401);
  }
};