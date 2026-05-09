import { Router } from "express";
import multer from "multer";

import { auth } from "../middlewares/auth";

import { makeUploadAndPersistImageController } from "../factories/make-upload-and-persist-image-controller";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { makeGenerateListingTextController } from "../factories/make-generate-listing-text-controller";
import { makeProcessListingTextController } from "../factories/make-process-listing-text-controller";
import { makeGetListingController } from "../factories/make-get-listing-controller";
import { makeFetchRecentListingsController } from "../factories/make-fetch-recent-listings-controller";
import { makeCreateListingController } from "../factories/make-create-listing-controller";

const listingsRoutes = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Text-first creation and generation routes (from main)
listingsRoutes.post("/", auth, adaptRoute(makeCreateListingController()));
listingsRoutes.get("/:listingId", auth, adaptRoute(makeGetListingController()));
listingsRoutes.get("/", auth, adaptRoute(makeFetchRecentListingsController()));
listingsRoutes.patch("/generate-text/:listingId", auth, adaptRoute(makeGenerateListingTextController()));
listingsRoutes.post("/process-text", adaptRoute(makeProcessListingTextController()));

// Image upload route (from infra_cloudflareR2, adapted to be a separate step)
listingsRoutes.post(
  "/:listingId/image",
  auth,
  upload.single("file"),
  adaptRoute(makeUploadAndPersistImageController()),
);

export { listingsRoutes };
