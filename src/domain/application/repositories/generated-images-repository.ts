import { GeneratedImage } from "../../enterprise/entities/generated-image";

export interface GeneratedImagesRepository {
  createMany(images: GeneratedImage[]): Promise<void>;
  findManyByListingId(listingId: string): Promise<GeneratedImage[]>;
  findManyByListingIdAndUserId(
    listingId: string,
    userId: string,
  ): Promise<{ id: string; url: string; createdAt: Date }[]>;
}
