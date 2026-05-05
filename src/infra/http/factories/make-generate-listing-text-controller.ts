import { Controller } from "../../../core/infra/controller";
import { GenerateListingTextUseCase } from "../../../domain/application/use-cases/listing/generate-listing-text/generate-listing-text";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { GenerateListingTextController } from "../controllers/generate-listing-text-controller";

export function makeGenerateListingTextController(): Controller {
  const listingsRepository = new PrismaListingsRepository();
  const generateListingTextUseCase = new GenerateListingTextUseCase(listingsRepository);
  const generateListingTextController = new GenerateListingTextController(generateListingTextUseCase);

  return generateListingTextController;
}
