import { Router } from "express";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { makeGenerateListingController } from "../factories/make-generate-listing-controller";
import { auth } from "../middlewares/auth";
import { makeProcessListingController } from "../factories/make-process-listing-controller";
import { makeGetListingController } from "../factories/make-get-listing-controller";
import { makeFetchRecentListingsController } from "../factories/make-fetch-recent-listings-controller";

const listingsRoutes = Router();

listingsRoutes.post("/generate", auth, adaptRoute(makeGenerateListingController()));

listingsRoutes.post("/process", adaptRoute(makeProcessListingController()));

listingsRoutes.get("/:listingId", auth, adaptRoute(makeGetListingController()));

listingsRoutes.get("/", auth, adaptRoute(makeFetchRecentListingsController()));

export { listingsRoutes };
