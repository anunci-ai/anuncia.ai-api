import { UploadAndPersistImageUseCase } from "../../../domain/application/use-cases/upload-and-persist-image";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { R2Storage } from "../../storage/r2-storage";
import { UploadAndPersistImageController } from "../controllers/upload-and-persist-image-controller";

export function makeUploadAndPersistImageController() {
  const prismaListingsRepository = new PrismaListingsRepository();

  const r2Storage = new R2Storage();

  const uploadAndPersistImageUseCase = new UploadAndPersistImageUseCase(r2Storage, prismaListingsRepository);

  const uploadAndPersistImageController = new UploadAndPersistImageController(uploadAndPersistImageUseCase);

  return uploadAndPersistImageController;
}
