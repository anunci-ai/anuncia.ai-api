import { left, right } from "../../../core/either";
import { TextService } from "../../../infra/ai/text-service";
import { Listing, StatusEnum } from "../../enterprise/entities/listing";
import { ListingsRepository } from "../repositories/listings-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

type ProcessListingTextUseCaseRequest = {
  listingId: string;
};

export class ProcessListingTextUseCase {
  constructor(
    private listingsRepository: ListingsRepository,
    private textService: TextService,
  ) {}

  async execute({ listingId }: ProcessListingTextUseCaseRequest) {
    const listing = await this.listingsRepository.findById(listingId);

    if (!listing) {
      return left(new ResourceNotFoundError("Anúncio não foi encontrado."));
    }

    if (listing.status === "TEXT_COMPLETED") {
      return right(null);
    }

    try {
      const { id, userId, marketplace, inputDescription } = listing;

      const { generatedTitle, generatedDescription, generatedMetaDescription, generatedTags } =
        await this.textService.execute({ description: listing.inputDescription });

      const updatedListing = Listing.create(
        {
          userId,
          marketplace,
          inputDescription,
          generatedTitle,
          generatedDescription,
          generatedMetaDescription,
          generatedTags,
          status: "TEXT_COMPLETED" as StatusEnum,
        },
        id,
      );

      await this.listingsRepository.update(updatedListing);
    } catch (error) {
      await this.listingsRepository.updateStatus(listingId, "FAILED" as StatusEnum);
      throw error;
    }
  }
}
