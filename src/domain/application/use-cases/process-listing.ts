import { Either, left, right } from "../../../core/either";
import { TextService } from "../../../infra/ai/text-service";
import { Listing, StatusEnum } from "../../enterprise/entities/listing";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { ListingsRepository } from "../repositories/listings-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

type ProcessListingUseCaseRequest = {
  listingId: string;
};

type ProcessListingUseCaseResponse = Either<ResourceNotFoundError, null>;

export class ProcessListingUseCase {
  constructor(
    private listingsRepository: ListingsRepository,
    private textService: TextService,
  ) {}

  async execute({ listingId }: ProcessListingUseCaseRequest): Promise<ProcessListingUseCaseResponse> {
    const listing = await this.listingsRepository.findById(listingId);

    if (!listing) {
      return left(new ResourceNotFoundError("Anúncio não encontrado."));
    }

    if (listing.status === "COMPLETED") {
      return right(null);
    }

    const { generatedTitle, generatedDescription, generatedMetaDescription, generatedTags } =
      await this.textService.execute({ description: listing.shortDescription });

    const { id, userId, marketplace, subjectImageUrl, shortDescription } = listing;

    const updatedListing = Listing.create(
      {
        userId,
        marketplace,
        subjectImageUrl,
        shortDescription,
        generatedTitle,
        generatedDescription,
        generatedMetaDescription,
        generatedTags,
        generatedSlug: Slug.createFromText(generatedTitle),
        status: "COMPLETED" as StatusEnum,
      },
      id,
    );

    await this.listingsRepository.update(updatedListing);

    return right(null);
  }
}
