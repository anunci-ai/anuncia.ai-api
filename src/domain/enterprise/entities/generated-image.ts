import { Entity } from "../../../core/entitites/Entity";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";
import { Optional } from "../../../core/types/optional";

interface GeneratedImageProps {
  listingId: UniqueEntityId;
  url: string;
  createdAt?: Date;
}

export class GeneratedImage extends Entity<GeneratedImageProps> {
  get listingId() {
    return this.props.listingId;
  }

  get url() {
    return this.props.url;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<GeneratedImageProps, "createdAt">, id?: UniqueEntityId) {
    const generatedimage = new GeneratedImage(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return generatedimage;
  }
}
