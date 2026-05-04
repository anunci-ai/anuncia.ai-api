import { Either, right } from "../../../core/either";
import { ListingsRepository } from "../repositories/listings-repository";

type FetchRecentListingUseCaseRequest = {
  page: number;
  userId: string;
};

type ListingFormat = {
  id: string;
  inputDescription: string;
};

type FetchRecentListingUseCaseResponseData = {
  listings: ListingFormat[];
};

type FetchRecentListingUseCaseResponse = Either<null, FetchRecentListingUseCaseResponseData>;

export class FetchRecentListingUseCase {
  constructor(private listingsRepository: ListingsRepository) {}

  async execute({ userId, page }: FetchRecentListingUseCaseRequest): Promise<FetchRecentListingUseCaseResponse> {
    const listings = await this.listingsRepository.findManyRecentByUserId(userId, { page });

    return right({ listings });
  }
}
