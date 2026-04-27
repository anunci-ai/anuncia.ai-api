import { prisma } from "..";
import { ListingsRepository } from "../../../domain/application/repositories/listings-repository";
import { Listing } from "../../../domain/enterprise/entities/listing";
import { ListingMapper } from "../../../domain/enterprise/mappers/listing-mapper";
import { MarketplaceEnum as PrismaMarketplaceEnum, StatusEnum as PrismaStatusEnum } from "@prisma/client";

export class PrismaListingsRepository implements ListingsRepository {
  async create(listing: Listing): Promise<void> {
    const data = ListingMapper.toPersistence(listing);

    await prisma.listing.create({
      data,
    });
  }

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

  async update(listing: Listing): Promise<Listing> {
    const updatedListing = await prisma.listing.update({
      where: {
        id: listing.id.toString(),
      },
      data: {
        status: listing.status as unknown as PrismaStatusEnum,
        generatedTitle: listing.generatedTitle,
        generatedDescription: listing.generatedDescription,
        generatedMetaDescription: listing.generatedMetaDescription,
        generatedSlug: listing.generatedSlug?.value,
        generatedTags: listing.generatedTags,
      },
    });

    return ListingMapper.toDomain(updatedListing);
  }

  async save(listing: Listing): Promise<Listing> {
    const newListing = await prisma.listing.create({
      data: {
        userId: listing.userId.toString(),
        marketplace: listing.marketplace as unknown as PrismaMarketplaceEnum,
        subjectImageUrl: listing.subjectImageUrl,
        shortDescription: listing.shortDescription,
        status: listing.status as unknown as PrismaStatusEnum,
      },
    });

    return ListingMapper.toDomain(newListing);
  }
}
