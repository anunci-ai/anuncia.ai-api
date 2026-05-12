import { Controller } from "../../../core/infra/controller";
import { ProcessListingImagesUseCase } from "../../../domain/application/use-cases/listing/process-listing-images/process-listing-images";
import { ImageService } from "../../ai/image-service";
import { PrismaGeneratedImagesRepository } from "../../prisma/repositories/prisma-generated-images-repository";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { R2Storage } from "../../storage/r2-storage";
import { ProcessListingImagesController } from "../controllers/process-listing-images-controller";

export function makeProcessListingImagesController(): Controller {
  const listingsRepository = new PrismaListingsRepository();
  const generatedImagesRepository = new PrismaGeneratedImagesRepository();
  const imageService = new ImageService();
  const uploader = new R2Storage();
  const processListingImagesUseCase = new ProcessListingImagesUseCase(
    listingsRepository,
    generatedImagesRepository,
    imageService,
    uploader,
  );
  const processListingImagesController = new ProcessListingImagesController(processListingImagesUseCase);

  return processListingImagesController;
}
