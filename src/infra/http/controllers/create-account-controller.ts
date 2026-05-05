import { CreateUserUseCase } from "../../../domain/application/use-cases/user/create-user/create-user";
import { Controller } from "../../../core/infra/controller";
import { clientError, conflict, created, fail, HttpResponse } from "../../../core/infra/http-response";
import { z, ZodError } from "zod";

const createUserControllerRequest = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

type CreateUserControllerRequest = z.infer<typeof createUserControllerRequest>;

export class CreateUserController implements Controller {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(request: CreateUserControllerRequest): Promise<HttpResponse> {
    try {
      const { name, email, password } = createUserControllerRequest.parse(request);

      const result = await this.createUserUseCase.execute({ name, email, password });

      if (result.isLeft()) {
        const error = result.value;

        return conflict(error.message);
      }

      const { userId } = result.value;

      return created({ userId });
    } catch (err) {
      if (err instanceof ZodError) {
        return clientError(z.prettifyError(err));
      }

      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
