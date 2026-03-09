import { Entity } from "../../../core/entitites/Entity";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";
import { Optional } from "../../../core/types/optional";
import { Slug } from "./value-objects/slug";

enum MarketplaceEnum {
  MERCADO_LIVRE,
  SHOPIFY,
}

enum StatusEnum {
  PROCESSING,
  COMPLETED,
  FAILED,
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
