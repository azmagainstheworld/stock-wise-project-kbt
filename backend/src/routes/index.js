import { Router } from "express";
import authRoutes from "./auth.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import predictionRoutes from "./prediction.routes.js";
import productRoutes from "./product.routes.js";
import reportRoutes from "./report.routes.js";
import settingsRoutes from "./settings.routes.js";
import transactionRoutes from "./transaction.routes.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", requireAuth, productRoutes);
router.use("/transactions", requireAuth, transactionRoutes);
router.use("/settings", requireAuth, settingsRoutes);
router.use("/dashboard", requireAuth, dashboardRoutes);
router.use("/reports", requireAuth, reportRoutes);
router.use("/predictions", requireAuth, predictionRoutes);

export default router;
