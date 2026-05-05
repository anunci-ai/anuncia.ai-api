import { Either, left, right } from "../../../../../core/either";
import { TextService } from "../../../../../infra/ai/text-service";
import { Listing, StatusEnum } from "../../../../enterprise/entities/listing";
import { ListingsRepository } from "../../../repositories/listings-repository";
import { ResourceNotFoundError } from "./../../_errors/resource-not-found-error";
import { ProcessListingTextDTO } from "./process-listing-text-dto";

type ProcessListingTextUseCaseResponse = Either<ResourceNotFoundError, null>;

export class ProcessListingTextUseCase {
  constructor(
    private listingsRepository: ListingsRepository,
    private textService: TextService,
  ) {}

  async execute({ listingId }: ProcessListingTextDTO): Promise<ProcessListingTextUseCaseResponse> {
    const listing = await this.listingsRepository.findById(listingId);

    if (!listing) {
      return left(new ResourceNotFoundError("Anúncio não foi encontrado."));
    }

    if (listing.status === "TEXT_COMPLETED") {
      return right(null);
    }

    try {
      const { id, userId, marketplace, inputDescription } = listing;

      const textServiceResult = await this.textService.execute({ description: listing.inputDescription });

      const updatedListing = Listing.create(
        {
          userId,
          marketplace,
          inputDescription,
          status: "TEXT_COMPLETED" as StatusEnum,
          ...textServiceResult,
        },
        id,
      );

      await this.listingsRepository.update(updatedListing);

      return right(null);
    } catch (error) {
      await this.listingsRepository.updateStatus(listingId, "FAILED" as StatusEnum);
      throw error;
    }
  }
}
