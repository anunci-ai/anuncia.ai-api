import { Controller } from "../../../core/infra/controller";
import { GenerateListingUseCase } from "../../../domain/application/use-cases/generate-listing";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { GenerateListingController } from "../controllers/generate-listing-controller";

export function makeGenerateListingController(): Controller {
  const listingsRepository = new PrismaListingsRepository();
  const generateListingUseCase = new GenerateListingUseCase(listingsRepository);
  const generateListingController = new GenerateListingController(generateListingUseCase);

  return generateListingController;
}
