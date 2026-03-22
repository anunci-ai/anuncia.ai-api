import { UploadAndPersistImageUseCase } from "../../../domain/application/use-cases/upload-and-persist-image";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { R2Storage } from "../../storage/r2-storage";
import { UploadAndPersistImageController } from "../controllers/upload-and-persist-image-controller";

export function makeUploadAndPersistImageController() {
  // 1. Instanciamos o Repositório do banco de dados (Prisma)
  const prismaListingsRepository = new PrismaListingsRepository();

  // 2. Instanciamos o provedor de Storage real (Cloudflare R2)
  const r2Storage = new R2Storage();

  // 3. Injetamos os dois no nosso Caso de Uso! (O motor do carro)
  const uploadAndPersistImageUseCase = new UploadAndPersistImageUseCase(r2Storage, prismaListingsRepository);

  // 4. Injetamos o Caso de Uso no Controller
  const uploadAndPersistImageController = new UploadAndPersistImageController(uploadAndPersistImageUseCase);

  return uploadAndPersistImageController;
}
