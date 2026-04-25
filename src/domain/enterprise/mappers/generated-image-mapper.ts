import { GeneratedImage } from "../entities/generated-image";
import { GeneratedImage as PersistenceGeneratedImage } from "@prisma/client";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";

export class AccountMapper {
  static toDomain(raw: PersistenceGeneratedImage) {
    return GeneratedImage.create(
      {
        listingId: new UniqueEntityId(raw.listingId),
        url: raw.url,
        createdAt: new Date(raw.createdAt),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPersistence(generatedImage: GeneratedImage): PersistenceGeneratedImage {
    return {
      id: generatedImage.id.toString(),
      listingId: generatedImage.listingId.toString(),
      url: generatedImage.url,
      createdAt: generatedImage.createdAt ?? new Date(),
    };
  }
}
