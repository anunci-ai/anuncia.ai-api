import z, { ZodError } from "zod";
import { Controller } from "../../../core/infra/controller";
import { clientError, fail, HttpResponse, ok } from "../../../core/infra/http-response";
import { FetchListingsAnalyticsUseCase } from "../../../domain/application/use-cases/listing/fetch-listing-analytics/fetch-listing-analytics";

const fetchListingsAnalyticsControllerRequest = z.object({
  userId: z.uuid(),
});

type FetchListingsAnalyticsControllerRequest = z.infer<typeof fetchListingsAnalyticsControllerRequest>;

export class FetchListingsAnalyticsController implements Controller {
  constructor(private fetchListingsAnalyticsUseCase: FetchListingsAnalyticsUseCase) {}

  async handle(request: FetchListingsAnalyticsControllerRequest): Promise<HttpResponse> {
    try {
      const { userId } = fetchListingsAnalyticsControllerRequest.parse(request);

      const result = await this.fetchListingsAnalyticsUseCase.execute({ userId });

      if (result.isLeft()) {
        return clientError();
      }

      const { analytics } = result.value;

      return ok({ analytics });
    } catch (err) {
      if (err instanceof ZodError) {
        return clientError(z.prettifyError(err));
      }

      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
