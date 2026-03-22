import { Listing } from "../../enterprise/entities/listing";

export interface ListingsRepository {
  create(listing: Listing): Promise<void>;
}
