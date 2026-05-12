import { Router } from "express";
import { auth } from "../middlewares/auth";
import { upload } from "../multer/upload";
import { adaptRoute } from "../../../core/infra/adapters/express-route-adapter";
import { makeUploadAndPersistImageController } from "../factories/make-upload-and-persist-image-controller";

const uploadRoutes = Router();

uploadRoutes.post("/", auth, upload.single("image"), adaptRoute(makeUploadAndPersistImageController()));

export { uploadRoutes };
