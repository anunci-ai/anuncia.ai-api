import { Either, right } from "../../../../../core/either";
import { GeneratedImagesRepository } from "../../../repositories/generated-images-repository";
import { GetGeneratedImagesDTO } from "./get-generated-images-dto";
import { GetGeneratedImagesResponse } from "./get-generated-images-response";

type GetGeneratedImagesUseCaseResponse = Either<null, GetGeneratedImagesResponse>;

export class GetGeneratedImagesUseCase {
  constructor(private generatedImagesRepository: GeneratedImagesRepository) {}

  async execute({ listingId, userId }: GetGeneratedImagesDTO): Promise<GetGeneratedImagesUseCaseResponse> {
    const images = await this.generatedImagesRepository.findManyByListingIdAndUserId(listingId, userId);

    return right({
      images,
    });
  }
}
