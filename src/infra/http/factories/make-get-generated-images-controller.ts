import { Controller } from "../../../core/infra/controller";
import { GetGeneratedImagesUseCase } from "../../../domain/application/use-cases/generated-images/get-generated-images/get-generated-images";
import { PrismaGeneratedImagesRepository } from "../../prisma/repositories/prisma-generated-images-repository";
import { GetGeneratedImagesController } from "../controllers/get-generated-images-controller";

export function makeGetGeneratedImagesController(): Controller {
  const generatedImagesRepository = new PrismaGeneratedImagesRepository();
  const getGeneratedImagesUseCase = new GetGeneratedImagesUseCase(generatedImagesRepository);
  const getGeneratedImagesController = new GetGeneratedImagesController(getGeneratedImagesUseCase);

  return getGeneratedImagesController;
}
