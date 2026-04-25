import { z } from "zod";
import { GenerateListingUseCase } from "../../../domain/application/use-cases/generate-listing";
import { fail, ok } from "../../../core/infra/http-response";
import { MarketplaceEnum } from "../../../domain/enterprise/entities/listing";

const generateListingRequest = z.object({
  userId: z.uuid(),
  marketplace: z.enum(["MERCADO_LIVRE", "SHOPIFY"]),
  subjectImageUrl: z.url(),
  shortDescription: z.string(),
});

type GenerateListingRequest = z.infer<typeof generateListingRequest>;

export class GenerateListingController {
  constructor(private generateListingUseCase: GenerateListingUseCase) {}

  async handle(request: GenerateListingRequest) {
    try {
      const { userId, marketplace, subjectImageUrl, shortDescription } = generateListingRequest.parse(request);

      const result = await this.generateListingUseCase.execute({
        userId,
        marketplace: marketplace as MarketplaceEnum,
        subjectImageUrl,
        shortDescription,
      });

      if (result.isLeft()) {
        return;
      }

      return ok(result.value);
    } catch (err) {
      if (err instanceof Error) {
        return fail(err);
      }
      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
