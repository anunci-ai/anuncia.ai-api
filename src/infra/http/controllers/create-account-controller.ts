import { CreateAccountUseCase } from "../../../domain/application/use-cases/create-account";
import { Controller } from "../../../core/infra/controller";
import { conflict, created, fail, HttpResponse } from "../../../core/infra/http-response";
import { z } from "zod";

const createAccountControllerRequest = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

type CreateAccountControllerRequest = z.infer<typeof createAccountControllerRequest>;

export class CreateAccountController implements Controller {
  constructor(private createAccountUseCase: CreateAccountUseCase) {}

  async handle(request: CreateAccountControllerRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = createAccountControllerRequest.parse(request);

      const result = await this.createAccountUseCase.execute({ name, email, password });

      if (result.isLeft()) {
        const error = result.value;

        return conflict(error.message);
      }

      const { userId } = result.value;

      return created({ userId });
    } catch (err) {
      if (err instanceof Error) {
        return fail(err);
      }
      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
