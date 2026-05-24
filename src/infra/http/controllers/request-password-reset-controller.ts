import { z, ZodError } from "zod";
import { Controller } from "../../../core/infra/controller";
import { RequestPasswordResetUseCase } from "../../../domain/application/use-cases/user/request-password-reset/request-password-reset";
import { HttpResponse, clientError, ok, fail } from "../../../core/infra/http-response";

const requestPasswordResetSchema = z.object({
  email: z.string().email(),
});

type RequestPasswordResetRequest = z.infer<typeof requestPasswordResetSchema>;

export class RequestPasswordResetController implements Controller {
  constructor(private requestPasswordResetUseCase: RequestPasswordResetUseCase) {}

  async handle(request: RequestPasswordResetRequest): Promise<HttpResponse> {
    try {
      const { email } = requestPasswordResetSchema.parse(request);

      const result = await this.requestPasswordResetUseCase.execute({ email });

      if (result.isLeft()) {
        const error = result.value;
        return clientError(error.message);
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
