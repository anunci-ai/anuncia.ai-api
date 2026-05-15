import { Either, right } from "../../../../../core/either";
import { ListingsRepository } from "../../../repositories/listings-repository";
import { FetchListingsAnalyticsDTO } from "./fetch-listing-analytics-dto";
import { FetchListingsAnalyticsResponse } from "./fetch-listing-analytics-response";

export type FetchListingsAnalyticsUseCaseResponse = Either<null, FetchListingsAnalyticsResponse>;

export class FetchListingsAnalyticsUseCase {
  constructor(private listingsRepository: ListingsRepository) {}

  async execute({ userId }: FetchListingsAnalyticsDTO): Promise<FetchListingsAnalyticsUseCaseResponse> {
    const [totalListings, listingsLastMonth] = await Promise.all([
      this.listingsRepository.countTotalByUserId(userId),
      this.listingsRepository.countLastMonthByUserId(userId),
    ]);

    return right({
      analytics: {
        listings: {
          total: totalListings,
          lastMonth: listingsLastMonth,
        },
      },
    });
  }
}
