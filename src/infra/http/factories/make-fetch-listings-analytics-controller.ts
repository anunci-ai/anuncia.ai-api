import { FetchListingsAnalyticsUseCase } from "../../../domain/application/use-cases/listing/fetch-listing-analytics/fetch-listing-analytics";
import { PrismaListingsRepository } from "../../prisma/repositories/prisma-listings-repository";
import { FetchListingsAnalyticsController } from "../controllers/fetch-listings-analytics-controller";

export function makeFetchListingsAnalyticsController() {
  const listingsRepository = new PrismaListingsRepository();
  const fetchListingsAnalyticsUseCase = new FetchListingsAnalyticsUseCase(listingsRepository);
  const fetchListingsAnalyticsController = new FetchListingsAnalyticsController(fetchListingsAnalyticsUseCase);

  return fetchListingsAnalyticsController;
}
