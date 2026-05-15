import { prisma } from "..";
import { PaginationParams } from "../../../core/repositories/pagination-params";
import { ListingsRepository } from "../../../domain/application/repositories/listings-repository";
import { Listing, StatusEnum } from "../../../domain/enterprise/entities/listing";
import { ListingMapper } from "../../../domain/enterprise/mappers/listing-mapper";
import { Prisma } from "@prisma/client";
import { subDays, format } from "date-fns";

export class PrismaListingsRepository implements ListingsRepository {
  async countLastMonthByUserId(userId: string): Promise<{ date: string; count: number }[]> {
    const startDate = subDays(new Date(), 30);

    const groupedListings = await prisma.listing.groupBy({
      by: ["createdAt"],
      where: {
        userId,
        createdAt: {
          gte: startDate,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const map = new Map<string, number>();

    for (const item of groupedListings) {
      const date = format(item.createdAt, "yyyy-MM-dd");

      map.set(date, (map.get(date) ?? 0) + item._count.id);
    }

    const lastMonth = Array.from({ length: 30 }).map((_, index) => {
      const date = format(subDays(new Date(), 29 - index), "yyyy-MM-dd");

      return {
        date,
        count: map.get(date) ?? 0,
      };
    });

    return lastMonth;
  }

  async countTotalByUserId(userId: string): Promise<number> {
    const total = await prisma.listing.count({
      where: {
        userId,
      },
    });

    return total;
  }

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
    const data = ListingMapper.toPersistence(listing);

    const updatedListing = await prisma.listing.update({
      where: {
        id: listing.id.toString(),
      },
      data,
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
