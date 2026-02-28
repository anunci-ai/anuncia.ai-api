import { Entity } from "../../../core/entitites/Entity";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";
import { Slug } from "./value-objects/slug";

interface AdvertisementProps {
  subjectImageUrl: string;
  description: string;
  title?: string;
  metaDescription?: string;
  metaTitle?: string;
  generatedImagesUrls?: string[];
  slug?: Slug;
  ecommerce: "MERCADO_LIVRE" | "SHOPIFY";
  userId: UniqueEntityId;
}

export class Advertisement extends Entity<AdvertisementProps> {
  static create(props: AdvertisementProps, id?: UniqueEntityId) {
    const advertisement = new Advertisement(props, id);

    return advertisement;
  }
}
