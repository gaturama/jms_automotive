import { Router } from "express";
import authRoutes from "./auth.routes";
import carRoutes from "./car.routes";
import userRoutes from "./user.routes";
import favoriteRoutes from "./favorite.routes";
import reviewRoutes from "./review.routes";
import historyRoutes from "./history.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/cars", carRoutes);
router.use("/users", userRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/reviews", reviewRoutes);
router.use("/history", historyRoutes);

export default router;
