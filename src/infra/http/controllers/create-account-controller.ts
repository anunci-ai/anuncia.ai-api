import { CreateAccountUseCase } from "../../../domain/application/use-cases/create-account";
import { Controller } from "../../../core/infra/controller";
import { conflict, created, fail, HttpResponse } from "../../../core/infra/http-response";

type CreateAccountUseCaseRequest = {
  name: string;
  email: string;
  password: string;
};

export class CreateAccountController implements Controller {
  constructor(private createAccountUseCase: CreateAccountUseCase) {}

  async handle({ name, email, password }: CreateAccountUseCaseRequest): Promise<HttpResponse> {
    try {
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
