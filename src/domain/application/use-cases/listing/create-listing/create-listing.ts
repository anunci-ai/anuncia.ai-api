import { Either, left, right } from "../../../../../core/either";
import { UniqueEntityId } from "../../../../../core/entities/unique-entity-id";
import { Listing, StatusEnum } from "../../../../enterprise/entities/listing";
import { ListingsRepository } from "../../../repositories/listings-repository";
import { CreateListingDTO } from "./create-listing-dto";
import { CreateListingResponse } from "./create-listing-response";
import { SubscriptionsRepository } from "../../../repositories/subscriptions-repository";
import { InsufficientTokensError } from "../../_errors/insufficient-tokens-error";
import { InactiveSubscriptionError } from "../../_errors/inactive-subscription-error";
import { UnitOfWork } from "../../../../../core/unit-of-work";

type CreateListingUseCaseResponse = Either<InactiveSubscriptionError | InsufficientTokensError, CreateListingResponse>;

export class CreateListingUseCase {
  constructor(
    private listingsRepository: ListingsRepository,
    private subscriptionsRepository: SubscriptionsRepository,
    private unitOfWork: UnitOfWork,
  ) {}

  async execute({ userId, inputDescription, marketplace }: CreateListingDTO): Promise<CreateListingUseCaseResponse> {
    const subscription = await this.subscriptionsRepository.findByUserId(userId);

    if (!subscription || !subscription.isActive) {
      return left(new InactiveSubscriptionError());
    }

    if (subscription.tokensRemaining === 0) {
      return left(new InsufficientTokensError());
    }

    const { id } = await this.unitOfWork.execute(async (trx) => {
      subscription.consumeTokens(200);
      await this.subscriptionsRepository.save(subscription, trx);

      const newListing = Listing.create({
        userId: new UniqueEntityId(userId),
        marketplace,
        inputDescription,
        status: "DRAFT" as StatusEnum,
      });

      const createdListing = await this.listingsRepository.save(newListing);

      return createdListing;
    });

    return right({ listingId: id.toString() });
  }
}
