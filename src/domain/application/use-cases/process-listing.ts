import { Either, left, right } from "../../../core/either";
import { googleAI } from "../../../infra/google/ai";
import { prompt, SEOListingData } from "../../../infra/prompt";
import { Listing, StatusEnum } from "../../enterprise/entities/listing";
import { Slug } from "../../enterprise/entities/value-objects/slug";
import { ListingsRepository } from "../repositories/listings-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { generateText } from "ai";

type ProcessListingUseCaseRequest = {
  listingId: string;
};

type ProcessListingUseCaseResponse = Either<ResourceNotFoundError, null>;

export class ProcessListingUseCase {
  constructor(private listingsRepository: ListingsRepository) {}

  async execute({ listingId }: ProcessListingUseCaseRequest): Promise<ProcessListingUseCaseResponse> {
    const listing = await this.listingsRepository.findById(listingId);

    if (!listing) {
      return left(new ResourceNotFoundError("Anúncio não encontrado."));
    }

    if (listing.status === "COMPLETED") {
      return right(null);
    }

    const { text } = await generateText({
      model: googleAI("gemini-2.5-flash"),
      prompt: prompt(listing.shortDescription),
    });

    const generatedListingText = text
      .trim()
      .replace(/```json\n?/g, "")
      .replace(/```\n?$/g, "");

    const { generatedTitle, generatedDescription, generatedMetaDescription, generatedTags } = JSON.parse(
      generatedListingText,
    ) as SEOListingData;

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
