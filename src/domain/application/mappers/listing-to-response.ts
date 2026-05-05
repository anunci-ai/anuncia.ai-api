import { Listing } from "../../enterprise/entities/listing";
import { GetListingResponse } from "../use-cases/listing/get-listing/get-listing-response";

export class ListingToResponseMapper {
  static toDTO(listing: Listing): GetListingResponse["listing"] {
    return {
      id: listing.id.toString(),
      marketplace: listing.marketplace,
      status: listing.status,
      inputDescription: listing.inputDescription,
      originalImageUrl: listing.originalImageUrl,
      generatedTitle: listing.generatedTitle,
      generatedDescription: listing.generatedDescription,
      generatedMetaTitle: listing.generatedMetaTitle,
      generatedMetaDescription: listing.generatedMetaDescription,
      generatedTags: listing.generatedTags,
      generatedSlug: listing.generatedSlug?.value,
      createdAt: listing.createdAt,
      updatedAt: listing.updatedAt,
    };
  }
}
