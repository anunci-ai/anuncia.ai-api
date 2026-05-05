import { Either, right } from "../../../../../core/either";
import { ListingsRepository } from "../../../repositories/listings-repository";
import { FetchRecentListingsDTO } from "./fetch-recent-listings-dto";
import { FetchRecentListingsResponse } from "./fetch-recent-listings-response";

type FetchRecentListingsUseCaseResponse = Either<null, FetchRecentListingsResponse>;

export class FetchRecentListingsUseCase {
  constructor(private listingsRepository: ListingsRepository) {}

  async execute({ userId, page }: FetchRecentListingsDTO): Promise<FetchRecentListingsUseCaseResponse> {
    const listings = await this.listingsRepository.findManyRecentByUserId(userId, { page });

    return right({ listings });
  }
}
