import { Either, right } from "../../../core/either";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { env } from "../../../infra/env";
import { qstash } from "../../../infra/qstash";
import { Listing, MarketplaceEnum, StatusEnum } from "../../enterprise/entities/listing";
import { ListingsRepository } from "../repositories/listings-repository";

type GenerateListingUseCaseRequest = {
  userId: string;
  marketplace: MarketplaceEnum;
  subjectImageUrl: string;
  shortDescription: string;
};

type GenerateListingUseCaseResponseData = {
  listingId: string;
  status: string;
};

type GenerateListingUseCaseResponse = Either<null, GenerateListingUseCaseResponseData>;

export class GenerateListingUseCase {
  constructor(private listingsRepository: ListingsRepository) {}

  async execute({
    userId,
    marketplace,
    subjectImageUrl,
    shortDescription,
  }: GenerateListingUseCaseRequest): Promise<GenerateListingUseCaseResponse> {
    const newListing = Listing.create({
      userId: new UniqueEntityId(userId),
      marketplace,
      subjectImageUrl,
      shortDescription,
      status: "PROCESSING" as StatusEnum,
    });

    const listing = await this.listingsRepository.save(newListing);

    if (env.NODE_ENV === "production") {
      await qstash.publishJSON({
        url: "https://api.anunciaai.com/v1/listings/process",
        body: {
          listingId: listing.id.toString(),
        },
      });
    }

    return right({
      listingId: listing.id.toString(),
      status: listing.status,
    });
  }
}
