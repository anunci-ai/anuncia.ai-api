import { Router } from "express";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { makeGenerateListingController } from "../factories/make-generate-listing-controller";
import { auth } from "../middlewares/auth";
import { makeProcessListingController } from "../factories/make-process-listing-controller";

const listingsRoutes = Router();

listingsRoutes.post("/generate", auth, adaptRoute(makeGenerateListingController()));

listingsRoutes.post("/process", adaptRoute(makeProcessListingController()));

export { listingsRoutes };
