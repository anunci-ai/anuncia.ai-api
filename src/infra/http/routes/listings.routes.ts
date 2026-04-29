import { Router } from "express";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { auth } from "../middlewares/auth";
import { makeGetListingController } from "../factories/make-get-listing-controller";
import { makeFetchRecentListingsController } from "../factories/make-fetch-recent-listings-controller";
import { makeCreateListingController } from "../factories/make-create-listing-controller";

const listingsRoutes = Router();

// listingsRoutes.post("/generate", auth, adaptRoute(makeGenerateListingController()));
// listingsRoutes.post("/process", adaptRoute(makeProcessListingController()));

listingsRoutes.post("/", auth, adaptRoute(makeCreateListingController()));

listingsRoutes.get("/:listingId", auth, adaptRoute(makeGetListingController()));

listingsRoutes.get("/", auth, adaptRoute(makeFetchRecentListingsController()));

export { listingsRoutes };
