import { Controller } from "../../../core/infra/controller";
import { FetchRecentListingUseCase } from "../../../domain/application/use-cases/fetch-recent-listings";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { FetchRecentListingsController } from "../controllers/fetch-recent-listings-controller";

export function makeFetchRecentListingsController(): Controller {
  const listingsRepository = new PrismaListingsRepository();
  const fetchRecentListingsUseCase = new FetchRecentListingUseCase(listingsRepository);
  const fetchRecentListingsController = new FetchRecentListingsController(fetchRecentListingsUseCase);

  return fetchRecentListingsController;
}
