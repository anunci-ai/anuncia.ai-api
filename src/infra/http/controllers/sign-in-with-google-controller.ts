import { z } from "zod";
import { SignInWithGoogleUseCase } from "../../../domain/application/use-cases/sign-in-with-google";
import { created, fail, HttpResponse, unauthorized } from "../../../core/infra/http-response";
import { Controller } from "../../../core/infra/controller";

const signInWithGoogleRequest = z.object({
  googleIdToken: z.string({ message: "Google ID Token is missing!" }),
});

type SignInWithGoogleRequest = z.infer<typeof signInWithGoogleRequest>;

export class SignInWithGoogleController implements Controller {
  constructor(private signInWithGoogleUseCase: SignInWithGoogleUseCase) {}

  async handle(request: SignInWithGoogleRequest): Promise<HttpResponse> {
    try {
      const { googleIdToken } = signInWithGoogleRequest.parse(request);

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
