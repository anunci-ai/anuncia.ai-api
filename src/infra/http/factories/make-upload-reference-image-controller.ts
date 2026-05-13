import { UploadReferenceImageUseCase } from "../../../domain/application/use-cases/listing/upload-reference-image/upload-reference-image";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { R2Storage } from "../../storage/r2-storage";
import { UploadReferenceImageController } from "../controllers/upload-reference-image-controller";

export function makeUploadReferenceImageController() {
  const r2Storage = new R2Storage();
  const listingsRepository = new PrismaListingsRepository();
  const uploadReferenceImageUseCase = new UploadReferenceImageUseCase(listingsRepository, r2Storage);
  const uploadReferenceImageController = new UploadReferenceImageController(uploadReferenceImageUseCase);

  return uploadReferenceImageController;
}
