import { Controller } from "../../../core/infra/controller";
import { CreateListingUseCase } from "../../../domain/application/use-cases/create-listing";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { CreateListingController } from "../controllers/create-listing-controller";

export function makeCreateListingController(): Controller {
  const listingsRepository = new PrismaListingsRepository();
  const createListingUseCase = new CreateListingUseCase(listingsRepository);
  const createListingController = new CreateListingController(createListingUseCase);

  return createListingController;
}
