import { Controller } from "../../../core/infra/controller";
import { CreateListingUseCase } from "../../../domain/application/use-cases/listing/create-listing/create-listing";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { PrismaSubscriptionsRepository } from "../../prisma/repositories/prisma-subscriptions-repository";
import { CreateListingController } from "../controllers/create-listing-controller";

export function makeCreateListingController(): Controller {
  const listingsRepository = new PrismaListingsRepository();
  const subscriptionsRepository = new PrismaSubscriptionsRepository();
  const createListingUseCase = new CreateListingUseCase(listingsRepository, subscriptionsRepository);
  const createListingController = new CreateListingController(createListingUseCase);

  return createListingController;
}
