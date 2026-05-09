import { UploadAndPersistImageUseCase } from "../../../domain/application/use-cases/upload-and-persist-image";

import { R2Storage } from "../../storage/r2-storage";
import { UploadAndPersistImageController } from "../controllers/upload-and-persist-image-controller";

export function makeUploadAndPersistImageController() {
  const r2Storage = new R2Storage();

  const uploadAndPersistImageUseCase = new UploadAndPersistImageUseCase(r2Storage);

  const uploadAndPersistImageController = new UploadAndPersistImageController(uploadAndPersistImageUseCase);

  return uploadAndPersistImageController;
}
