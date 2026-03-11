import { Controller } from "../../../core/infra/controller";
import { created, HttpResponse } from "../../../core/infra/http-response";
import { SignInWithPasswordUseCase } from "../../../domain/application/use-cases/sign-in-with-password";

type SignInWithPasswordRequest = {
  email: string;
  password: string;
};

export class SignInWithPasswordController implements Controller {
  constructor(private signInWithPasswordUseCase: SignInWithPasswordUseCase) {}

  async handle({ email, password }: SignInWithPasswordRequest): Promise<HttpResponse> {
    const { token } = await this.signInWithPasswordUseCase.execute({ email, password });

    return created({ token });
  }
}
