import { Controller } from "../../../core/infra/controller";
import { clientError, fail, HttpResponse, ok } from "../../../core/infra/http-response";
import { GetProfileUseCase } from "../../../domain/application/use-cases/get-profile";

type GetProfileControllerRequest = {
  userId: string;
};

export class GetProfileController implements Controller {
  constructor(private getProfileUseCase: GetProfileUseCase) {}

  async handle({ userId }: GetProfileControllerRequest): Promise<HttpResponse> {
    try {
      const result = await this.getProfileUseCase.execute({ userId });

      if (result.isLeft()) {
        const error = result.value;

        return clientError(error.message);
      }

      const { user } = result.value;

      return ok({ user });
    } catch (err) {
      if (err instanceof Error) {
        return fail(err);
      }
      // If 'err' is not an Error, wrap it
      return fail(new Error(String(err)));
    }
  }
}
