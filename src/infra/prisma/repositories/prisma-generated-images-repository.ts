import { GeneratedImagesRepository } from "../../../domain/application/repositories/generated-images-repository";
import { GeneratedImage } from "../../../domain/enterprise/entities/generated-image";
import { GeneratedImageMapper } from "../../../domain/enterprise/mappers/generated-image-mapper";
import { prisma } from "..";

export class PrismaGeneratedImagesRepository implements GeneratedImagesRepository {
  async findManyByListingIdAndUserId(
    listingId: string,
    userId: string,
  ): Promise<{ id: string; url: string; createdAt: Date }[]> {
    const rows = await prisma.generatedImage.findMany({
      select: {
        id: true,
        url: true,
        createdAt: true,
      },
      where: {
        listingId,
        listing: {
          userId,
        },
      },
    });

    return rows;
  }

  async createMany(images: GeneratedImage[]): Promise<void> {
    const data = images.map(GeneratedImageMapper.toPersistence);

    await prisma.generatedImage.createMany({ data });
  }

  async findManyByListingId(listingId: string): Promise<GeneratedImage[]> {
    const rows = await prisma.generatedImage.findMany({ where: { listingId } });

    return rows.map(GeneratedImageMapper.toDomain);
  }
}
