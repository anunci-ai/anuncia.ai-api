import { Either, left, right } from "../../../../../core/either";
import { InvalidFileTypeError } from "../../_errors/invalid-file-type-error";
import { Uploader } from "../../../storage/uploader";
import { UploadAndPersistImageDTO } from "./upload-and-persist-image-dto";
import { UploadAndPersistImageResponse } from "./upload-and-persist-image-response";
import { isValidImageType } from "../../../../enterprise/validators/is-valid-image-type";

type UploadAndPersistImageUseCaseResponse = Either<InvalidFileTypeError, UploadAndPersistImageResponse>;

export class UploadAndPersistImageUseCase {
  constructor(private uploader: Uploader) {}

  async execute({ fileName, fileType, body }: UploadAndPersistImageDTO): Promise<UploadAndPersistImageUseCaseResponse> {
    if (!isValidImageType(fileType)) {
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
