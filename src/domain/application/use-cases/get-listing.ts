import { Either, left, right } from "../../../core/either";
import { ListingsRepository } from "../repositories/listings-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

type GetListingUseCaseRequest = {
  listingId: string;
  userId: string;
};

type GetListingUseCaseResponseData = {
  listing: {
    id: string;
    marketplace: string;
    status: string;
    inputDescription: string;
    originalImageUrl?: string;
    generatedTitle?: string;
    generatedDescription?: string;
    generatedMetaTitle?: string;
    generatedMetaDescription?: string;
    generatedTags?: string[];
    generatedSlug?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
};

type GetListingUseCaseResponse = Either<ResourceNotFoundError, GetListingUseCaseResponseData>;

export class GetListingUseCase {
  constructor(private listingsRepository: ListingsRepository) {}

  async execute({ listingId, userId }: GetListingUseCaseRequest): Promise<GetListingUseCaseResponse> {
    const listing = await this.listingsRepository.findByIdAndUserId(listingId, userId);

    if (!listing) {
      return left(new ResourceNotFoundError("Anúncio não encontrado."));
    }

    return right({
      listing: {
        id: listing.id.toString(),
        marketplace: listing.marketplace,
        status: listing.status,
        originalImageUrl: listing.originalImageUrl,
        inputDescription: listing.inputDescription,
        generatedTitle: listing.generatedTitle,
        generatedDescription: listing.generatedDescription,
        generatedMetaTitle: listing.generatedMetaTitle,
        generatedMetaDescription: listing.generatedMetaDescription,
        generatedTags: listing.generatedTags,
        generatedSlug: listing.generatedSlug?.value,
        createdAt: listing.createdAt,
        updatedAt: listing.updatedAt,
      },
    });
  }
}
