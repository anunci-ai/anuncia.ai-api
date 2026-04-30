import { z } from "zod";
import { fail, notFound, ok } from "../../../core/infra/http-response";
import { GenerateListingTextUseCase } from "../../../domain/application/use-cases/generate-listing-text";

const generateListingTextControllerRequest = z.object({
  listingId: z.uuid(),
});

type GenerateListingTextControllerRequest = z.infer<typeof generateListingTextControllerRequest>;

export class GenerateListingTextController {
  constructor(private generateListingTextUseCase: GenerateListingTextUseCase) {}

  async handle(request: GenerateListingTextControllerRequest) {
    try {
      const { listingId } = generateListingTextControllerRequest.parse(request);

      const result = await this.generateListingTextUseCase.execute({
        listingId,
      });

      if (result.isLeft()) {
        const error = result.value;

        return notFound(error.message);
      }

      return ok();
    } catch (err) {
      if (err instanceof Error) {
        return fail(err);
      }
      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
