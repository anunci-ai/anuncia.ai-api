import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { listingsRoutes } from "./listings.routes";
import { uploadRoutes } from "./upload.routes";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/listings", listingsRoutes);
routes.use("/uploads", uploadRoutes);
