import { Controller } from "../../../core/infra/controller";
import { clientError, created, fail, HttpResponse } from "../../../core/infra/http-response";
import { SignInWithPasswordUseCase } from "../../../domain/application/use-cases/sign-in-with-password";

type SignInWithPasswordRequest = {
  email: string;
  password: string;
};

export class SignInWithPasswordController implements Controller {
  constructor(private signInWithPasswordUseCase: SignInWithPasswordUseCase) {}

  async handle({ email, password }: SignInWithPasswordRequest): Promise<HttpResponse> {
    try {
      const result = await this.signInWithPasswordUseCase.execute({ email, password });

      if (result.isLeft()) {
        const error = result.value;

        return clientError(error.message);
      }

      const { token } = result.value;

      return created({ token });
    } catch (err) {
      if (err instanceof Error) {
        return fail(err);
      }
      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
