import { Router } from "express";
import {
  getCars,
  getCarById,
  compareCars,
  createCar,
  updateCar,
  deleteCar,
} from "../controllers/car.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { adminMiddleware } from "../middlewares/admin.middleware";

const router = Router();

router.get("/", getCars);
router.get("/compare", compareCars);
router.get("/:id", getCarById);
router.post("/", authMiddleware, adminMiddleware, createCar);
router.put("/:id", authMiddleware, adminMiddleware, updateCar);
router.delete("/:id", authMiddleware, adminMiddleware, deleteCar);

export default router;
