import jwt from "jsonwebtoken";

export const generateAccessToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN ||
      "7d") as jwt.SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
      "30d") as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
