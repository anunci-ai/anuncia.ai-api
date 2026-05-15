import { Router } from "express";
import { auth } from "../middlewares/auth";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { makeFetchListingsAnalyticsController } from "../factories/make-fetch-listings-analytics-controller";

const analyticsRoutes = Router();

analyticsRoutes.get("/", auth, adaptRoute(makeFetchListingsAnalyticsController()));

export { analyticsRoutes };
