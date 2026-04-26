import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { listingsRoutes } from "./listings.routes";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/listings", listingsRoutes);
