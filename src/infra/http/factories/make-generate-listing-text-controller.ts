import { Controller } from "../../../core/infra/controller";
import { GenerateListingTextUseCase } from "../../../domain/application/use-cases/listing/generate-listing-text/generate-listing-text";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { QStashService } from "../../qstash/qstash-service";
import { GenerateListingTextController } from "../controllers/generate-listing-text-controller";

export function makeGenerateListingTextController(): Controller {
  const listingsRepository = new PrismaListingsRepository();
  const queueService = new QStashService();
  const generateListingTextUseCase = new GenerateListingTextUseCase(listingsRepository, queueService);
  const generateListingTextController = new GenerateListingTextController(generateListingTextUseCase);

  return generateListingTextController;
}
