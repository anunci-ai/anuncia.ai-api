import { Router } from "express";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { makeFetchPlansController } from "../factories/make-fetch-plans-controller";

const plansRoutes = Router();

plansRoutes.get("/", adaptRoute(makeFetchPlansController()));

export { plansRoutes };
