import { Entity } from "../../../core/entitites/Entity";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";
import { Optional } from "../../../core/types/optional";
import { Slug } from "./value-objects/slug";

export enum MarketplaceEnum {
  MERCADO_LIVRE = "MERCADO_LIVRE",
  SHOPIFY = "SHOPIFY",
}

export enum StatusEnum {
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

interface ListingProps {
  userId: UniqueEntityId;
  marketplace: MarketplaceEnum;
  status: StatusEnum;
  subjectImageUrl: string;
  shortDescription: string;
  generatedTitle?: string;
  generatedDescription?: string;
  generatedMetaTitle?: string;
  generatedMetaDescription?: string;
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

  get subjectImageUrl() {
    return this.props.subjectImageUrl;
  }

  get shortDescription() {
    return this.props.shortDescription;
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
