import { Listing } from "../../enterprise/entities/listing";

export interface ListingsRepository {
  findByIdAndUserId(id: string, userId: string): Promise<Listing | null>;
  findById(id: string): Promise<Listing | null>;
  update(listing: Listing): Promise<Listing>;
  save(listing: Listing): Promise<Listing>;
}
