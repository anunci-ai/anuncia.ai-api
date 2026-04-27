import { Router } from "express";
import multer from "multer";

import { auth } from "../middlewares/auth";

import { makeUploadAndPersistImageController } from "../factories/make-upload-and-persist-image-controller";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { makeGenerateListingController } from "../factories/make-generate-listing-controller";
import { makeProcessListingController } from "../factories/make-process-listing-controller";

const listingsRoutes = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

listingsRoutes.post("/", auth, upload.single("file"), adaptRoute(makeUploadAndPersistImageController()));
listingsRoutes.post("/generate", auth, adaptRoute(makeGenerateListingController()));
listingsRoutes.post("/process", adaptRoute(makeProcessListingController()));

export { listingsRoutes };
