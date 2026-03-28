import { Either, left, right } from "../../../core/either";
import { Uploader } from "../storage/uploader";
import { Listing, MarketplaceEnum, StatusEnum } from "../../enterprise/entities/listing";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";
import { ListingsRepository } from "../repositories/listings-repository";

export class InvalidFileTypeError extends Error {
  constructor() {
    super("Tipo de arquivo inválido. Apenas imagens são permitidas.");
    this.name = "InvalidFileTypeError";
  }
}

type UploadAndPersistImageUseCaseRequest = {
  userId: string;
  fileName: string;
  fileType: string;
  body: Buffer;
  marketplace: "MERCADO_LIVRE" | "SHOPIFY";
  shortDescription: string;
};

type UploadAndPersistImageUseCaseResponse = Either<
  InvalidFileTypeError,
  {
    listing: Listing;
  }
>;

export class UploadAndPersistImageUseCase {
  constructor(
    private uploader: Uploader,
    private listingsRepository: ListingsRepository,
  ) {}

  async execute({
    userId,
    fileName,
    fileType,
    body,
    marketplace,
    shortDescription,
  }: UploadAndPersistImageUseCaseRequest): Promise<UploadAndPersistImageUseCaseResponse> {
    if (!/^(image\/(jpeg|png|webp))$/.test(fileType)) {
      return left(new InvalidFileTypeError());
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    const listing = Listing.create({
      userId: new UniqueEntityId(userId),
      marketplace: marketplace as MarketplaceEnum,
      status: StatusEnum.PROCESSING,
      subjectImageUrl: url,
      shortDescription,
    });

    await this.listingsRepository.create(listing);

    return right({
      listing,
    });
  }
}
