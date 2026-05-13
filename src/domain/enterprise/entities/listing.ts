import { Entity } from "../../../core/entities/Entity";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Optional } from "../../../core/types/optional";
import { Slug } from "./value-objects/slug";

export enum MarketplaceEnum {
  MERCADO_LIVRE = "MERCADO_LIVRE",
  SHOPIFY = "SHOPIFY",
}

// export enum StatusEnum {
//   PENDING = "PENDING",
//   PROCESSING = "PROCESSING",
//   COMPLETED = "COMPLETED",
//   FAILED = "FAILED",
// }

export enum StatusEnum {
  DRAFT = "DRAFT",
  TEXT_PROCESSING = "TEXT_PROCESSING",
  TEXT_COMPLETED = "TEXT_COMPLETED",
  IMAGE_PROCESSING = "IMAGE_PROCESSING",
  IMAGE_COMPLETED = "IMAGE_COMPLETED",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

interface ListingProps {
  userId: UniqueEntityId;
  inputDescription: string;
  marketplace: MarketplaceEnum;
  status: StatusEnum;
  generatedTitle?: string;
  generatedDescription?: string;
  generatedMetaTitle?: string;
  generatedMetaDescription?: string;
  originalImageUrl?: string;
  generatedTags?: string[];
  generatedSlug?: Slug;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Listing extends Entity<ListingProps> {
  get userId() {
    return this.props.userId;
  }

  get marketplace() {
    return this.props.marketplace;
  }

  get status() {
    return this.props.status;
  }

  get originalImageUrl() {
    return this.props.originalImageUrl;
  }

  get inputDescription() {
    return this.props.inputDescription;
  }

  get generatedTitle() {
    return this.props.generatedTitle;
  }

  get generatedDescription() {
    return this.props.generatedDescription;
  }

  get generatedMetaTitle() {
    return this.props.generatedMetaTitle;
  }

  get generatedMetaDescription() {
    return this.props.generatedMetaDescription;
  }

  get generatedTags() {
    return this.props.generatedTags;
  }

  get generatedSlug() {
    return this.props.generatedSlug;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = new Date();
  }

  set status(status: StatusEnum) {
    this.props.status = status;
    this.touch();
  }

  public assignOriginalImageUrl(imageUrl: string) {
    if (!imageUrl) {
      return;
    }

    this.props.originalImageUrl = imageUrl;
    this.touch();
  }

  static create(props: Optional<ListingProps, "createdAt">, id?: UniqueEntityId) {
    const listing = new Listing(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return listing;
  }
}
