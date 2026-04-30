import { z } from "zod";
import { fail, notFound, ok } from "../../../core/infra/http-response";
import { ProcessListingTextUseCase } from "../../../domain/application/use-cases/process-listing-text";

const processListingTextControllerRequest = z.object({
  listingId: z.uuid(),
});

type ProcessListingTextControllerRequest = z.infer<typeof processListingTextControllerRequest>;

export class ProcessListingTextController {
  constructor(private processListingTextUseCase: ProcessListingTextUseCase) {}

  async handle(request: ProcessListingTextControllerRequest) {
    try {
      const { listingId } = processListingTextControllerRequest.parse(request);

      const result = await this.processListingTextUseCase.execute({
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
