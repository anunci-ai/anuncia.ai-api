import { z } from "zod";
import { fail, notFound, ok } from "../../../core/infra/http-response";
import { ProcessListingUseCase } from "../../../domain/application/use-cases/process-listing";

const processListingRequest = z.object({
  listingId: z.uuid(),
});

type ProcessListingRequest = z.infer<typeof processListingRequest>;

export class ProcessListingController {
  constructor(private processListingUseCase: ProcessListingUseCase) {}

  async handle(request: ProcessListingRequest) {
    try {
      const { listingId } = processListingRequest.parse(request);

      const result = await this.processListingUseCase.execute({ listingId });

      if (result.isLeft()) {
        return notFound(result.value.message);
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
