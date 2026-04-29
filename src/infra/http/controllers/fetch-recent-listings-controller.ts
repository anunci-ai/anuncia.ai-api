import { Controller } from "../../../core/infra/controller";
import { clientError, fail, HttpResponse, ok } from "../../../core/infra/http-response";
import { FetchRecentListingUseCase } from "../../../domain/application/use-cases/fetch-recent-listings";

type FetchRecentListingsControllerRequest = {
  userId: string;
  page?: string;
};

export class FetchRecentListingsController implements Controller {
  constructor(private fetchRecentListingsUseCase: FetchRecentListingUseCase) {}

  async handle({ userId, page }: FetchRecentListingsControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.fetchRecentListingsUseCase.execute({ userId, page: Number(page ?? "1") });

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
