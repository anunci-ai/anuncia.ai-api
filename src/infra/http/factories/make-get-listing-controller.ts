import { Controller } from "../../../core/infra/controller";
import { GetListingUseCase } from "../../../domain/application/use-cases/listing/get-listing/get-listing";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { GetListingController } from "../controllers/get-listing-controller";

export function makeGetListingController(): Controller {
  const listingsRepository = new PrismaListingsRepository();
  const getListingUseCase = new GetListingUseCase(listingsRepository);
  const getListingController = new GetListingController(getListingUseCase);

  return getListingController;
}
