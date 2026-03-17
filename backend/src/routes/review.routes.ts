import { Router } from "express";
import {
  getCarReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controllers/review.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/car/:carId", getCarReviews);
router.post("/:carId", authMiddleware, createReview);
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;
