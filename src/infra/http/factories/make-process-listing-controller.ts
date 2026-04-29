import { Controller } from "../../../core/infra/controller";
import { ProcessListingUseCase } from "../../../domain/application/use-cases/process-listing";
import { TextService } from "../../ai/text-service";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { ProcessListingController } from "../controllers/process-listing-controller";

export function makeProcessListingController(): Controller {
  const listingsRepository = new PrismaListingsRepository();
  const textService = new TextService();
  const processListingUseCase = new ProcessListingUseCase(listingsRepository, textService);
  const processListingController = new ProcessListingController(processListingUseCase);

  return processListingController;
}
