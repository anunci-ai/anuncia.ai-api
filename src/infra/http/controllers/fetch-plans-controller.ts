import { z, ZodError } from "zod";
import { Controller } from "../../../core/infra/controller";
import { clientError, fail, HttpResponse, ok } from "../../../core/infra/http-response";
import { FetchPlansUseCase } from "../../../domain/application/use-cases/plan/fetch-plans/fetch-plans";

export class FetchPlansController implements Controller {
  constructor(private fetchPlansUseCase: FetchPlansUseCase) {}

  async handle(): Promise<HttpResponse> {
    try {
      const result = await this.fetchPlansUseCase.execute();

      if (result.isLeft()) {
        return clientError("Error ao buscar os planos");
      }

      const { plans } = result.value;

      return ok({ plans });
    } catch (err) {
      if (err instanceof ZodError) {
        return clientError(z.prettifyError(err));
      }

      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
