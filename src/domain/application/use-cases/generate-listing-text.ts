import { Either, left, right } from "../../../core/either";
import { env } from "../../../infra/env";
import { qstash } from "../../../infra/qstash";
import { StatusEnum } from "../../enterprise/entities/listing";
import { ListingsRepository } from "../repositories/listings-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

type GenerateListingTextUseCaseRequest = {
  listingId: string;
};

type GenerateListingTextUseCaseResponse = Either<ResourceNotFoundError, null>;

export class GenerateListingTextUseCase {
  constructor(private listingsRepository: ListingsRepository) {}

  async execute({ listingId }: GenerateListingTextUseCaseRequest): Promise<GenerateListingTextUseCaseResponse> {
    const listing = await this.listingsRepository.findById(listingId);

    if (!listing) {
      return left(new ResourceNotFoundError("Anúncio não foi encontrado."));
    }

    await this.listingsRepository.updateStatus(listingId, "TEXT_PROCESSING" as StatusEnum);

    if (env.NODE_ENV === "production") {
      await qstash.publishJSON({
        url: "https://api.anunciaai.com/v1/listings/process-text",
        body: {
          listingId: listing.id.toString(),
        },
      });
    }

    return right(null);
  }
}
