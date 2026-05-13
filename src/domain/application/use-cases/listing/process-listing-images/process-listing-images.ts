import { Either, left, right } from "../../../../../core/either";
import { UniqueEntityId } from "../../../../../core/entities/unique-entity-id";
import { ImageService } from "../../../../../infra/ai/image-service";
import { GeneratedImage } from "../../../../enterprise/entities/generated-image";
import { StatusEnum } from "../../../../enterprise/entities/listing";
import { GeneratedImagesRepository } from "../../../repositories/generated-images-repository";
import { ListingsRepository } from "../../../repositories/listings-repository";
import { Uploader } from "../../../storage/uploader";
import { ResourceNotFoundError } from "../../_errors/resource-not-found-error";
import { ProcessListingImagesDTO } from "./process-listing-images-dto";

type ProcessListingImagesUseCaseResponse = Either<ResourceNotFoundError, null>;

export class ProcessListingImagesUseCase {
  constructor(
    private listingsRepository: ListingsRepository,
    private generatedImagesRepository: GeneratedImagesRepository,
    private imageService: ImageService,
    private uploader: Uploader,
  ) {}

  async execute({ listingId }: ProcessListingImagesDTO): Promise<ProcessListingImagesUseCaseResponse> {
    const listing = await this.listingsRepository.findById(listingId);

    if (!listing) {
      return left(new ResourceNotFoundError("Anúncio não foi encontrado."));
    }

    if (listing.status === "IMAGE_COMPLETED" || listing.status === "COMPLETED") {
      return right(null);
    }

    try {
      const { urls: falUrls } = await this.imageService.execute({
        inputImageUrl: listing.originalImageUrl!,
      });

      const r2Urls = await Promise.all(
        falUrls.map(async (falUrl, i) => {
          const imageResponse = await fetch(falUrl);
          const body = Buffer.from(await imageResponse.arrayBuffer());

          const { url } = await this.uploader.upload({
            fileName: `${listingId}-${i}.png`,
            fileType: "image/png",
            body,
          });

          return url;
        }),
      );

      const generatedImages = r2Urls.map((url) =>
        GeneratedImage.create({
          listingId: new UniqueEntityId(listingId),
          url,
        }),
      );

      await this.generatedImagesRepository.createMany(generatedImages);

      const nextStatus = listing.generatedTitle ? ("COMPLETED" as StatusEnum) : ("IMAGE_COMPLETED" as StatusEnum);

      await this.listingsRepository.updateStatus(listingId, nextStatus);

      return right(null);
    } catch (error) {
      await this.listingsRepository.updateStatus(listingId, "FAILED" as StatusEnum);
      throw error;
    }
  }
}
