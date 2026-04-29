import { PaginationParams } from "../../../core/repositories/pagination-params";
import { Listing } from "../../enterprise/entities/listing";

export interface ListingsRepository {
  findManyRecentByUserId(userId: string, params: PaginationParams): Promise<{ id: string; shortDescription: string }[]>;
  findByIdAndUserId(id: string, userId: string): Promise<Listing | null>;
  findById(id: string): Promise<Listing | null>;
  update(listing: Listing): Promise<Listing>;
  save(listing: Listing): Promise<Listing>;
}
