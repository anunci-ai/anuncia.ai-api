import { z } from "zod";
import { SignInWithGoogleUseCase } from "../../../domain/application/use-cases/sign-in-with-google";
import { created, fail, HttpResponse, unauthorized } from "../../../core/infra/http-response";
import { Controller } from "../../../core/infra/controller";

const signInWithGoogleControllerRequest = z.object({
  googleIdToken: z.string({ message: "Google ID Token is missing!" }),
});

type SignInWithGoogleControllerRequest = z.infer<typeof signInWithGoogleControllerRequest>;

export class SignInWithGoogleController implements Controller {
  constructor(private signInWithGoogleUseCase: SignInWithGoogleUseCase) {}

  async handle(request: SignInWithGoogleControllerRequest): Promise<HttpResponse> {
    try {
      const { googleIdToken } = signInWithGoogleControllerRequest.parse(request);

      const result = await this.signInWithGoogleUseCase.execute({
        googleIdToken,
      });

      if (result.isLeft()) {
        const error = result.value;
        return unauthorized(error.message);
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
