import { Either, right } from "../../../core/either";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Listing, MarketplaceEnum, StatusEnum } from "../../enterprise/entities/listing";
import { ListingsRepository } from "../repositories/listings-repository";

type CreateListingUseCaseRequest = {
  userId: string;
  marketplace: MarketplaceEnum;
  inputDescription: string;
};

type CreateListingUseCaseResponse = Either<null, { listingId: string }>;

export class CreateListingUseCase {
  constructor(private listingsRepository: ListingsRepository) {}

  async execute({
    userId,
    inputDescription,
    marketplace,
  }: CreateListingUseCaseRequest): Promise<CreateListingUseCaseResponse> {
    const newListing = Listing.create({
      userId: new UniqueEntityId(userId),
      marketplace,
      inputDescription,
      status: "DRAFT" as StatusEnum,
    });

    const { id } = await this.listingsRepository.save(newListing);

    return right({ listingId: id.toString() });
  }
}
