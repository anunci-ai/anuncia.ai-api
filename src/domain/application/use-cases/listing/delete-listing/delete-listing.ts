import { Either, left, right } from "../../../../../core/either";
import { ListingsRepository } from "../../../repositories/listings-repository";
import { ResourceNotFoundError } from "../../_errors/resource-not-found-error";
import { DeleteListingDTO } from "./delete-listing-dto";

export type DeleteListingUseCaseResponse = Either<ResourceNotFoundError, null>;

export class DeleteListingUseCase {
  constructor(private listingsRepository: ListingsRepository) {}

  async execute({ userId, listingId }: DeleteListingDTO): Promise<DeleteListingUseCaseResponse> {
    const listing = await this.listingsRepository.findByIdAndUserId(listingId, userId);

    if (!listing) {
      return left(new ResourceNotFoundError("Anúncio não encontrado."));
    }

    await this.listingsRepository.delete(listing.id.toString());

    return right(null);
  }
}
