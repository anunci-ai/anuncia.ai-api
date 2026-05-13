import { Either, left, right } from "../../../../../core/either";
import { ListingsRepository } from "../../../repositories/listings-repository";
import { Uploader } from "../../../storage/uploader";
import { ResourceNotFoundError } from "../../_errors/resource-not-found-error";
import { UploadReferenceImageDTO } from "./upload-reference-image-dto";

export type UploadReferenceImageUseCaseResponse = Either<ResourceNotFoundError, { url: string }>;

export class UploadReferenceImageUseCase {
  constructor(
    private listingsRepository: ListingsRepository,
    private uploader: Uploader,
  ) {}

  async execute({
    userId,
    listingId,
    body,
    fileName,
    fileType,
  }: UploadReferenceImageDTO): Promise<UploadReferenceImageUseCaseResponse> {
    const listing = await this.listingsRepository.findByIdAndUserId(listingId, userId);

    if (!listing) {
      return left(new ResourceNotFoundError("Anúncio não foi encontrado."));
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    listing.assignOriginalImageUrl(url);
    this.listingsRepository.update(listing);

    return right({
      url,
    });
  }
}
