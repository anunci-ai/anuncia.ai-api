import { Listing } from "../../enterprise/entities/listing";

export interface ListingsRepository {
  findById(id: string): Promise<Listing | null>;
  update(listing: Listing): Promise<Listing>;
  save(listing: Listing): Promise<Listing>;
}
