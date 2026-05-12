import { Controller } from "../../../core/infra/controller";
import { GenerateListingImagesUseCase } from "../../../domain/application/use-cases/listing/generate-listing-images/generate-listing-images";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { QStashService } from "../../qstash/qstash-service";
import { GenerateListingImagesController } from "../controllers/generate-listing-images-controller";

export function makeGenerateListingImagesController(): Controller {
  const listingsRepository = new PrismaListingsRepository();
  const queueService = new QStashService();
  const generateListingImagesUseCase = new GenerateListingImagesUseCase(listingsRepository, queueService);
  const generateListingImagesController = new GenerateListingImagesController(generateListingImagesUseCase);

  return generateListingImagesController;
}
