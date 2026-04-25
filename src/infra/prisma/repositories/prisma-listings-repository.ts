import { prisma } from "..";
import { ListingsRepository } from "../../../domain/application/repositories/listings-repository";
import { Listing } from "../../../domain/enterprise/entities/listing";
import { ListingMapper } from "../../../domain/enterprise/mappers/listing-mapper";

export class PrismaListingsRepository implements ListingsRepository {
  async findById(id: string): Promise<Listing | null> {
    const listing = await prisma.listing.findUnique({
      where: {
        id,
      },
    });

    if (!listing) {
      return null;
    }

    return ListingMapper.toDomain(listing);
  }

  async save(listing: Listing): Promise<Listing> {
    const newListing = await prisma.listing.create({
      data: {
        userId: listing.userId.toString(),
        marketplace: listing.marketplace,
        subjectImageUrl: listing.subjectImageUrl,
        shortDescription: listing.shortDescription,
        status: listing.status,
      },
    });

    return ListingMapper.toDomain(newListing);
  }
}
