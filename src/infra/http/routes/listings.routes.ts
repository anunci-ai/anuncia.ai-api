import { Router } from "express";
import multer from "multer";

import { auth } from "../middlewares/auth";

import { makeUploadAndPersistImageController } from "../factories/make-upload-and-persist-image-controller";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";

const listingsRoutes = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

listingsRoutes.post("/", auth, upload.single("file"), adaptRoute(makeUploadAndPersistImageController()));

export { listingsRoutes };
