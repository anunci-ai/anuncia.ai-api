import { Entity } from "../../../core/entitites/Entity";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";
import { Optional } from "../../../core/types/optional";

interface GeneratedImageProps {
  listingId: UniqueEntityId;
  url: string;
  createdAt?: Date;
}

export class GeneratedImage extends Entity<GeneratedImageProps> {
  static create(props: Optional<GeneratedImageProps, "createdAt">, id?: UniqueEntityId) {
    const generatedimage = new GeneratedImage(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return generatedimage;
  }
}
