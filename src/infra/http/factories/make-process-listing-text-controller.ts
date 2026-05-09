import { Controller } from "../../../core/infra/controller";
import { ProcessListingTextUseCase } from "../../../domain/application/use-cases/listing/process-listing-text/process-listing-text";
import { TextService } from "../../ai/text-service";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { ProcessListingTextController } from "../controllers/process-listing-text-controller";

export function makeProcessListingTextController(): Controller {
  const listingsRepository = new PrismaListingsRepository();
  const textService = new TextService();
  const processListingTextUseCase = new ProcessListingTextUseCase(listingsRepository, textService);
  const processListingTextController = new ProcessListingTextController(processListingTextUseCase);

  return processListingTextController;
}
