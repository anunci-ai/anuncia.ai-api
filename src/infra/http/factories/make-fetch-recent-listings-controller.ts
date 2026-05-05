import { Controller } from "../../../core/infra/controller";
import { FetchRecentListingsUseCase } from "../../../domain/application/use-cases/listing/fetch-recent-listings/fetch-recent-listings";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { FetchRecentListingsController } from "../controllers/fetch-recent-listings-controller";

export function makeFetchRecentListingsController(): Controller {
  const listingsRepository = new PrismaListingsRepository();
  const fetchRecentListingsUseCase = new FetchRecentListingsUseCase(listingsRepository);
  const fetchRecentListingsController = new FetchRecentListingsController(fetchRecentListingsUseCase);

  return fetchRecentListingsController;
}
