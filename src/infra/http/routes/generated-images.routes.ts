import { Router } from "express";
import { auth } from "../middlewares/auth";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { makeGetGeneratedImagesController } from "../factories/make-get-generated-images-controller";

const generatedImagesRoutes = Router();

generatedImagesRoutes.get("/:listingId", auth, adaptRoute(makeGetGeneratedImagesController()));

export { generatedImagesRoutes };
