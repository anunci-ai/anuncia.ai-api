import { Either, left, right } from "../../../../../core/either";
import { StatusEnum } from "../../../../enterprise/entities/listing";
import { QueueService } from "../../../queue/queue-service";
import { ListingsRepository } from "../../../repositories/listings-repository";
import { ResourceNotFoundError } from "../../_errors/resource-not-found-error";
import { GenerateListingTextDTO } from "./generate-listing-text-dto";

type GenerateListingTextUseCaseResponse = Either<ResourceNotFoundError, null>;

export class GenerateListingTextUseCase {
  constructor(
    private listingsRepository: ListingsRepository,
    private queueService: QueueService,
  ) {}

  async execute({ listingId }: GenerateListingTextDTO): Promise<GenerateListingTextUseCaseResponse> {
    const listing = await this.listingsRepository.findById(listingId);

    if (!listing) {
      return left(new ResourceNotFoundError("Anúncio não foi encontrado."));
    }

    await this.listingsRepository.updateStatus(listingId, "TEXT_PROCESSING" as StatusEnum);

    await this.queueService.publish("process-text", {
      listingId: listing.id.toString(),
    });

    return right(null);
  }
}
