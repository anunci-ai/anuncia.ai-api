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

    await qstash.publishJSON({
      url: `${env.API_URL}/v1/listings/process-text`,
      body: {
        listingId: listing.id.toString(),
      },
    });

    console.log("passou aqui");

    return right(null);
  }
}
