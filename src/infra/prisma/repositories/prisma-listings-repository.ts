import { prisma } from "..";
import { PaginationParams } from "../../../core/repositories/pagination-params";
import { ListingsRepository } from "../../../domain/application/repositories/listings-repository";
import { Listing, StatusEnum } from "../../../domain/enterprise/entities/listing";
import { ListingMapper } from "../../../domain/enterprise/mappers/listing-mapper";
import { Prisma, StatusEnum as PrismaStatusEnum } from "@prisma/client";

export class PrismaListingsRepository implements ListingsRepository {
  async delete(id: string): Promise<void> {
    await prisma.listing.delete({
      where: {
        id,
      },
    });
  }

  async create(listing: Listing): Promise<void> {
    const data = ListingMapper.toPersistence(listing);

    await prisma.listing.create({
      data,
    });
  }

  async updateStatus(id: string, status: StatusEnum): Promise<void> {
    await prisma.listing.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });
  }

  async findManyRecentByUserId(
    userId: string,
    { page }: PaginationParams,
  ): Promise<
    {
      id: string;
      inputDescription: string;
      marketplace: string;
      createdAt: Date;
      originalImageUrl: string | null;
    }[]
  > {
    const listings = await prisma.listing.findMany({
      select: {
        id: true,
        inputDescription: true,
        marketplace: true,
        createdAt: true,
        originalImageUrl: true,
      },
      where: {
        userId,
      },
      take: 20,
      skip: (page - 1) * 1,
      orderBy: {
        createdAt: "desc",
      },
    });

    return listings;
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Listing | null> {
    const listing = await prisma.listing.findUnique({
      where: {
        id,
        userId,
      },
    });

    if (!listing) {
      return null;
    }

    return ListingMapper.toDomain(listing);
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

  async save(listing: Listing, trx: Prisma.TransactionClient): Promise<Listing> {
    const client = trx ?? prisma;

    const newListing = await client.listing.create({
      data: {
        userId: listing.userId.toString(),
        marketplace: listing.marketplace,
        inputDescription: listing.inputDescription,
      },
    });

    return ListingMapper.toDomain(newListing);
  }
}
