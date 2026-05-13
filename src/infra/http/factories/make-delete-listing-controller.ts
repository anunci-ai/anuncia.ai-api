import { Controller } from "../../../core/infra/controller";
import { DeleteListingUseCase } from "../../../domain/application/use-cases/listing/delete-listing/delete-listing";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { DeleteListingController } from "../controllers/delete-listing-controller";

export function makeDeleteListingController(): Controller {
  const listingsRepository = new PrismaListingsRepository();
  const deleteListingUseCase = new DeleteListingUseCase(listingsRepository);
  const deleteListingController = new DeleteListingController(deleteListingUseCase);

  return deleteListingController;
}
