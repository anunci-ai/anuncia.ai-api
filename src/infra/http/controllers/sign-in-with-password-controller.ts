import { z, ZodError } from "zod";
import { Controller } from "../../../core/infra/controller";
import { clientError, created, fail, HttpResponse } from "../../../core/infra/http-response";
import { SignInWithPasswordUseCase } from "../../../domain/application/use-cases/sign-in-with-password";

const signInWithPasswordControllerRequest = z.object({
  email: z.email(),
  password: z.string(),
});

type SignInWithPasswordControllerRequest = z.infer<typeof signInWithPasswordControllerRequest>;

export class SignInWithPasswordController implements Controller {
  constructor(private signInWithPasswordUseCase: SignInWithPasswordUseCase) {}

  async handle(request: SignInWithPasswordControllerRequest): Promise<HttpResponse> {
    try {
      const { email, password } = signInWithPasswordControllerRequest.parse(request);

      const result = await this.signInWithPasswordUseCase.execute({ email, password });

      if (result.isLeft()) {
        const error = result.value;

        return clientError(error.message);
      }

      const { token } = result.value;

      return created({ token });
    } catch (err) {
      if (err instanceof ZodError) {
        return clientError(z.prettifyError(err));
      }

      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
