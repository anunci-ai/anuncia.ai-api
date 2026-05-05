import { Either, left, right } from "../../../../../core/either";
import { ListingToResponseMapper } from "../../../mappers/listing-to-response";
import { ListingsRepository } from "../../../repositories/listings-repository";
import { ResourceNotFoundError } from "../../_errors/resource-not-found-error";
import { GetListingDTO } from "./get-listing-dto";
import { GetListingResponse } from "./get-listing-response";

type GetListingUseCaseResponse = Either<ResourceNotFoundError, GetListingResponse>;

export class GetListingUseCase {
  constructor(private listingsRepository: ListingsRepository) {}

  async execute({ listingId, userId }: GetListingDTO): Promise<GetListingUseCaseResponse> {
    const listing = await this.listingsRepository.findByIdAndUserId(listingId, userId);

    if (!listing) {
      return left(new ResourceNotFoundError("Anúncio não encontrado."));
    }

    return right({
      listing: ListingToResponseMapper.toDTO(listing),
    });
  }
}
