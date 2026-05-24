import { z, ZodError } from "zod";
import { Controller } from "../../../core/infra/controller";
import { ResetPasswordUseCase } from "../../../domain/application/use-cases/user/reset-password/reset-password";
import { HttpResponse, clientError, ok, fail } from "../../../core/infra/http-response";

const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
});

type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;

export class ResetPasswordController implements Controller {
  constructor(private resetPasswordUseCase: ResetPasswordUseCase) {}

  async handle(request: ResetPasswordRequest): Promise<HttpResponse> {
    try {
      const { token, newPassword } = resetPasswordSchema.parse(request);

      const result = await this.resetPasswordUseCase.execute({
        token,
        newPassword,
      });

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
