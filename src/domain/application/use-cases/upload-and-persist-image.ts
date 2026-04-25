import { Either, left, right } from "../../../core/either";
import { InvalidFileTypeError } from "./errors/invalid-file-type-error";
import { Uploader } from "../storage/uploader";

type UploadAndPersistImageUseCaseRequest = {
  fileName: string;
  fileType: string;
  body: Buffer;
};

type UploadAndPersistImageUseCaseResponse = Either<
  InvalidFileTypeError,
  {
    url: string;
  }
>;

export class UploadAndPersistImageUseCase {
  constructor(private uploader: Uploader) {}

  async execute({
    fileName,
    fileType,
    body,
  }: UploadAndPersistImageUseCaseRequest): Promise<UploadAndPersistImageUseCaseResponse> {
    if (!/^(image\/(jpeg|png|webp))$/.test(fileType)) {
      return left(new InvalidFileTypeError());
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    });

    return right({
      url,
    });
  }
}
