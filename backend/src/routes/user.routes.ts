import { Router } from "express";
import {
  getPublicProfile,
  updateProfile,
  updateNotificationSettings,
  getStats,
  getMe,
  getUsers
} from "../controllers/user.controller";
import { authMiddleware} from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

router.get("/me", authMiddleware, getMe);
router.get("/stats", authMiddleware, getStats);
console.log('Registrando rota GET /users/list');
router.get('/list', authMiddleware, adminMiddleware, getUsers);
router.put("/profile", authMiddleware, updateProfile);
router.put("/notifications", authMiddleware, updateNotificationSettings);

router.get("/:id/profile", getPublicProfile);

export default router;
