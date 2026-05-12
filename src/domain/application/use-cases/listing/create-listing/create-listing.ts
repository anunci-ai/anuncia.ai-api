import { Either, left, right } from "../../../../../core/either";
import { UniqueEntityId } from "../../../../../core/entities/unique-entity-id";
import { Listing, StatusEnum } from "../../../../enterprise/entities/listing";
import { ListingsRepository } from "../../../repositories/listings-repository";
import { CreateListingDTO } from "./create-listing-dto";
import { CreateListingResponse } from "./create-listing-response";
import { SubscriptionsRepository } from "../../../repositories/subscriptions-repository";
import { InsufficientTokensError } from "../../_errors/insufficient-tokens-error";

type CreateListingUseCaseResponse = Either<InsufficientTokensError, CreateListingResponse>;

export class CreateListingUseCase {
  constructor(
    private listingsRepository: ListingsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({ userId, inputDescription, marketplace }: CreateListingDTO): Promise<CreateListingUseCaseResponse> {
    const subscription = await this.subscriptionsRepository.findByUserId(userId);

    if (!subscription || !subscription.isActive) {
      return left(new InsufficientTokensError());
    }

    try {
      subscription.consumeTokens(200);
      await this.subscriptionsRepository.save(subscription);
    } catch {
      return left(new InsufficientTokensError());
    }

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
