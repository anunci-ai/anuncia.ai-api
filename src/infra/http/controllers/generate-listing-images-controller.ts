import { z, ZodError } from "zod";
import { accepted, clientError, fail, notFound } from "../../../core/infra/http-response";
import { GenerateListingImagesUseCase } from "../../../domain/application/use-cases/listing/generate-listing-images/generate-listing-images";

const generateListingImagesControllerRequest = z.object({
  listingId: z.uuid(),
});

type GenerateListingImagesControllerRequest = z.infer<typeof generateListingImagesControllerRequest>;

export class GenerateListingImagesController {
  constructor(private generateListingImagesUseCase: GenerateListingImagesUseCase) {}

  async handle(request: GenerateListingImagesControllerRequest) {
    try {
      const { listingId } = generateListingImagesControllerRequest.parse(request);

      const result = await this.generateListingImagesUseCase.execute({ listingId });

      if (result.isLeft()) {
        return notFound(result.value.message);
      }

      return accepted();
    } catch (err) {
      if (err instanceof ZodError) {
        return clientError(z.prettifyError(err));
      }

      return fail(new Error(String(err)));
    }
  }
}
