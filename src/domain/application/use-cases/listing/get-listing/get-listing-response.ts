export interface GetListingResponse {
  listing: {
    id: string;
    marketplace: string;
    status: string;
    inputDescription: string;
    originalImageUrl?: string;
    generatedTitle?: string;
    generatedDescription?: string;
    generatedMetaTitle?: string;
    generatedMetaDescription?: string;
    generatedTags?: string[];
    generatedSlug?: string;
    createdAt?: Date;
    updatedAt?: Date;
  };
}
