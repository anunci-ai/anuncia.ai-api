import { z, ZodError } from "zod";
import { Controller } from "../../../core/infra/controller";
import { clientError, fail, HttpResponse, noContent, notFound } from "../../../core/infra/http-response";
import { DeleteListingUseCase } from "../../../domain/application/use-cases/listing/delete-listing/delete-listing";

const deleteListingControllerRequest = z.object({
  userId: z.uuid(),
  listingId: z.uuid(),
});

type DeleteListingControllerRequest = z.infer<typeof deleteListingControllerRequest>;

export class DeleteListingController implements Controller {
  constructor(private deleteListingUseCase: DeleteListingUseCase) {}

  async handle(request: DeleteListingControllerRequest): Promise<HttpResponse> {
    try {
      const { userId, listingId } = deleteListingControllerRequest.parse(request);

      const result = await this.deleteListingUseCase.execute({ userId, listingId });

      if (result.isLeft()) {
        return notFound(result.value.message);
      }

      return noContent();
    } catch (err) {
      if (err instanceof ZodError) {
        return clientError(z.prettifyError(err));
      }

      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
