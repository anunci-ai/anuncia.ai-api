import { ListingsRepository } from "../../../domain/application/repositories/listings-repository";
import { Listing } from "../../../domain/enterprise/entities/listing";
import { prisma } from "..";
import { ListingMapper } from "../../../domain/enterprise/mappers/listing-mapper";

export class PrismaListingsRepository implements ListingsRepository {
  async create(listing: Listing): Promise<void> {
    const data = ListingMapper.toPersistence(listing);

    await prisma.listing.create({
      data,
    });
  }
}
