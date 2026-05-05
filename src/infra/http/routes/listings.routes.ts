import { Router } from "express";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { auth } from "../middlewares/auth";
import { makeGetListingController } from "../factories/make-get-listing-controller";
import { makeFetchRecentListingsController } from "../factories/make-fetch-recent-listings-controller";
import { makeCreateListingController } from "../factories/make-create-listing-controller";
import { makeGenerateListingTextController } from "../factories/make-generate-listing-text-controller";
import { makeProcessListingTextController } from "../factories/make-process-listing-text-controller";

const listingsRoutes = Router();

listingsRoutes.post("/", auth, adaptRoute(makeCreateListingController()));

listingsRoutes.get("/:listingId", auth, adaptRoute(makeGetListingController()));

listingsRoutes.get("/", auth, adaptRoute(makeFetchRecentListingsController()));

listingsRoutes.patch("/generate-text/:listingId", auth, adaptRoute(makeGenerateListingTextController()));

listingsRoutes.post("/process-text", adaptRoute(makeProcessListingTextController()));

export { listingsRoutes };
