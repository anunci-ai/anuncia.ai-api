import { z } from "zod";
import { Controller } from "../../../core/infra/controller";
import { clientError, fail, HttpResponse, ok } from "../../../core/infra/http-response";
import { FetchRecentListingUseCase } from "../../../domain/application/use-cases/fetch-recent-listings";

const fetchRecentListingsControllerRequest = z.object({
  userId: z.uuid(),
  page: z.coerce.number().optional(),
});

type FetchRecentListingsControllerRequest = z.infer<typeof fetchRecentListingsControllerRequest>;

export class FetchRecentListingsController implements Controller {
  constructor(private fetchRecentListingsUseCase: FetchRecentListingUseCase) {}

  async handle(request: FetchRecentListingsControllerRequest): Promise<HttpResponse> {
    try {
      const { userId, page } = fetchRecentListingsControllerRequest.parse(request);

      const result = await this.fetchRecentListingsUseCase.execute({ userId, page: page ?? 1 });

      if (result.isLeft()) {
        return clientError();
      }

      const { listings } = result.value;

      return ok({ listings });
    } catch (err) {
      if (err instanceof Error) {
        return fail(err);
      }
      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
