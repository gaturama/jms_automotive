import { Router } from "express";
import { getConfig, updateConfig } from "../controllers/config.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

router.get("/", getConfig);
router.put("/", authMiddleware, adminMiddleware, updateConfig);

export default router;
