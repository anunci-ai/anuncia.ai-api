import { Either, left, right } from "../../../../../core/either";
import { StatusEnum } from "../../../../enterprise/entities/listing";
import { QueueService } from "../../../queue/queue-service";
import { ListingsRepository } from "../../../repositories/listings-repository";
import { ResourceNotFoundError } from "../../_errors/resource-not-found-error";
import { GenerateListingImagesDTO } from "./generate-listing-images-dto";

type GenerateListingImagesUseCaseResponse = Either<ResourceNotFoundError, null>;

export class GenerateListingImagesUseCase {
  constructor(
    private listingsRepository: ListingsRepository,
    private queueService: QueueService,
  ) {}

  async execute({ listingId }: GenerateListingImagesDTO): Promise<GenerateListingImagesUseCaseResponse> {
    const listing = await this.listingsRepository.findById(listingId);

    if (!listing) {
      return left(new ResourceNotFoundError("Anúncio não foi encontrado."));
    }

    if (!listing.originalImageUrl) {
      return left(new ResourceNotFoundError("Imagem original não encontrada. Faça o upload antes de gerar."));
    }

    await this.listingsRepository.updateStatus(listingId, "IMAGE_PROCESSING" as StatusEnum);

    await this.queueService.publish("process-images", {
      listingId: listing.id.toString(),
    });

    return right(null);
  }
}
