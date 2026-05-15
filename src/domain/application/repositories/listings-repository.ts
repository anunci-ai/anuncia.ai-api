import { PaginationParams } from "../../../core/repositories/pagination-params";
import { Listing, StatusEnum } from "../../enterprise/entities/listing";

export interface ListingsRepository {
  countLastMonthByUserId(userId: string): Promise<{ date: string; count: number }[]>;
  countTotalByUserId(userId: string): Promise<number>;
  delete(id: string): Promise<void>;
  create(listing: Listing): Promise<void>;
  updateStatus(id: string, status: StatusEnum): Promise<void>;
  findManyRecentByUserId(
    userId: string,
    params: PaginationParams,
  ): Promise<
    {
      id: string;
      inputDescription: string;
      marketplace: string;
      createdAt: Date;
      originalImageUrl: string | null;
    }[]
  >;
  findByIdAndUserId(id: string, userId: string): Promise<Listing | null>;
  findById(id: string): Promise<Listing | null>;
  update(listing: Listing): Promise<Listing>;
  save(listing: Listing, trx?: unknown): Promise<Listing>;
}
