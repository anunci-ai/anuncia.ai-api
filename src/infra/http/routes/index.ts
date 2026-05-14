import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { listingsRoutes } from "./listings.routes";
import { uploadRoutes } from "./upload.routes";
import { subscriptionsRoutes } from "./subscriptions.routes";
import { passwordRoutes } from "./password.routes";
import { generatedImagesRoutes } from "./generated-images.routes";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/listings", listingsRoutes);
routes.use("/uploads", uploadRoutes);
routes.use("/subscriptions", subscriptionsRoutes);
routes.use("/password", passwordRoutes);
routes.use("/images", generatedImagesRoutes);
