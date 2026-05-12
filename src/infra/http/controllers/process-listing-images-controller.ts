import { z, ZodError } from "zod";
import { clientError, fail, notFound, ok } from "../../../core/infra/http-response";
import { ProcessListingImagesUseCase } from "../../../domain/application/use-cases/listing/process-listing-images/process-listing-images";

const processListingImagesControllerRequest = z.object({
  listingId: z.uuid(),
});

type ProcessListingImagesControllerRequest = z.infer<typeof processListingImagesControllerRequest>;

export class ProcessListingImagesController {
  constructor(private processListingImagesUseCase: ProcessListingImagesUseCase) {}

  async handle(request: ProcessListingImagesControllerRequest) {
    try {
      const { listingId } = processListingImagesControllerRequest.parse(request);

      const result = await this.processListingImagesUseCase.execute({ listingId });

      if (result.isLeft()) {
        return notFound(result.value.message);
      }

      return ok();
    } catch (err) {
      if (err instanceof ZodError) {
        return clientError(z.prettifyError(err));
      }

      return fail(new Error(String(err)));
    }
  }
}
