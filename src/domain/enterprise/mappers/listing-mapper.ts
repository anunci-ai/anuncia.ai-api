import { Listing, MarketplaceEnum, StatusEnum } from "../entities/listing";
import { Listing as PersistenceListing } from "../../../../generated/prisma/client";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";
import { Slug } from "../entities/value-objects/slug";

export class ListingMapper {
  static toDomain(raw: PersistenceListing) {
    return Listing.create(
      {
        userId: new UniqueEntityId(raw.userId),
        marketplace: raw.marketplace as MarketplaceEnum,
        status: raw.status as StatusEnum,
        subjectImageUrl: raw.subjectImageUrl,
        shortDescription: raw.shortDescription,
        generatedTitle: raw.generatedTitle ?? undefined,
        generatedDescription: raw.generatedDescription ?? undefined,
        generatedMetaTitle: raw.generatedMetaTitle ?? undefined,
        generatedMetaDescription: raw.generatedMetaDescription ?? undefined,
        generatedTags: raw.generatedTags ?? [],
        generatedSlug: Slug.create(raw.generatedSlug ?? ""),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPersistence(listing: Listing): PersistenceListing {
    return {
      id: listing.id.toString(),
      userId: listing.userId.toString(),
      marketplace: listing.marketplace,
      status: listing.status,
      subjectImageUrl: listing.subjectImageUrl,
      shortDescription: listing.shortDescription,
      generatedTitle: listing.generatedTitle ?? null,
      generatedDescription: listing.generatedDescription ?? null,
      generatedMetaTitle: listing.generatedMetaTitle ?? null,
      generatedMetaDescription: listing.generatedMetaDescription ?? null,
      generatedTags: listing.generatedTags ?? [],
      generatedSlug: listing.generatedSlug?.value ?? null,
      createdAt: listing.createdAt ?? new Date(),
      updatedAt: listing.updatedAt ?? new Date(),
    };
  }
}
