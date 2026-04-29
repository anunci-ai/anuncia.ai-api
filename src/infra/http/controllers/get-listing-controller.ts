import { Controller } from "../../../core/infra/controller";
import { fail, HttpResponse, notFound, ok } from "../../../core/infra/http-response";
import { GetListingUseCase } from "../../../domain/application/use-cases/get-listing";

type GetListingControllerRequest = {
  userId: string;
  listingId: string;
};

export class GetListingController implements Controller {
  constructor(private getListingUseCase: GetListingUseCase) {}

  async handle({ userId, listingId }: GetListingControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.getListingUseCase.execute({ userId, listingId });

      if (result.isLeft()) {
        const error = result.value;

        return notFound(error.message);
      }

      const { listing } = result.value;

      return ok({ listing });
    } catch (err) {
      if (err instanceof Error) {
        return fail(err);
      }
      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
