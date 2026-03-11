import { CreateAccountUseCase } from "../../../domain/application/use-cases/create-account";
import { Controller } from "../../../core/infra/controller";
import { created, HttpResponse } from "../../../core/infra/http-response";

type CreateAccountUseCaseRequest = {
  name: string;
  email: string;
  password: string;
};

export class CreateAccountController implements Controller {
  constructor(private createAccountUseCase: CreateAccountUseCase) {}

  async handle({ name, email, password }: CreateAccountUseCaseRequest): Promise<HttpResponse> {
    const { userId } = await this.createAccountUseCase.execute({ name, email, password });

    return created({ userId });
  }
}
