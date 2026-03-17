import { Router } from "express";
import {
  getHistory,
  addToHistory,
  clearHistory,
} from "../controllers/history.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getHistory);
router.post("/:carId", addToHistory);
router.delete("/", clearHistory);

export default router;
