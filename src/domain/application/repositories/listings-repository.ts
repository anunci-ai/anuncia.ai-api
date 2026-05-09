import { PaginationParams } from "../../../core/repositories/pagination-params";
import { Listing, StatusEnum } from "../../enterprise/entities/listing";

export interface ListingsRepository {
  create(listing: Listing): Promise<void>;
  updateStatus(id: string, status: StatusEnum): Promise<void>;
  findManyRecentByUserId(userId: string, params: PaginationParams): Promise<{ id: string; inputDescription: string }[]>;
  findByIdAndUserId(id: string, userId: string): Promise<Listing | null>;
  findById(id: string): Promise<Listing | null>;
  update(listing: Listing): Promise<Listing>;
  save(listing: Listing): Promise<Listing>;
}
