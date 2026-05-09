import { Either, right } from "../../../../../core/either";
import { UniqueEntityId } from "../../../../../core/entities/unique-entity-id";
import { Listing, StatusEnum } from "../../../../enterprise/entities/listing";
import { ListingsRepository } from "../../../repositories/listings-repository";
import { CreateListingDTO } from "./create-listing-dto";
import { CreateListingResponse } from "./create-listing-response";

type CreateListingUseCaseResponse = Either<null, CreateListingResponse>;

export class CreateListingUseCase {
  constructor(private listingsRepository: ListingsRepository) {}

  async execute({ userId, inputDescription, marketplace }: CreateListingDTO): Promise<CreateListingUseCaseResponse> {
    const newListing = Listing.create({
      userId: new UniqueEntityId(userId),
      marketplace,
      inputDescription,
      status: "DRAFT" as StatusEnum,
    });

    const { id } = await this.listingsRepository.save(newListing);

    return right({ listingId: id.toString() });
  }
}
