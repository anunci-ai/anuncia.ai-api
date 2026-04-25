import { Router } from "express";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { makeGenerateListingController } from "../factories/make-generate-listing-controller";
import { auth } from "../middlewares/auth";

const listingsRoutes = Router();

listingsRoutes.post("/generate", auth, adaptRoute(makeGenerateListingController()));

export { listingsRoutes };
