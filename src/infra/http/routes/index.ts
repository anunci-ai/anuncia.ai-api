import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { listingsRoutes } from "./listings.routes";
import { uploadRoutes } from "./upload.routes";
import { subscriptionsRoutes } from "./subscriptions.routes";
import { generatedImagesRoutes } from "./generated-images.routes";
import { analyticsRoutes } from "./analytics.routes";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/listings", listingsRoutes);
routes.use("/uploads", uploadRoutes);
routes.use("/subscriptions", subscriptionsRoutes);
routes.use("/images", generatedImagesRoutes);
routes.use("/analytics", analyticsRoutes);
