import { Listing } from "../../enterprise/entities/listing";

export interface ListingsRepository {
  findById(id: string): Promise<Listing | null>;
  save(listing: Listing): Promise<Listing>;
}
