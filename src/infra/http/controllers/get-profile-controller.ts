import { z } from "zod";
import { Controller } from "../../../core/infra/controller";
import { clientError, fail, HttpResponse, ok } from "../../../core/infra/http-response";
import { GetProfileUseCase } from "../../../domain/application/use-cases/get-profile";

const getProfileControllerRequest = z.object({
  userId: z.uuid(),
});

type GetProfileControllerRequest = z.infer<typeof getProfileControllerRequest>;

export class GetProfileController implements Controller {
  constructor(private getProfileUseCase: GetProfileUseCase) {}

  async handle(request: GetProfileControllerRequest): Promise<HttpResponse> {
    try {
      const { userId } = getProfileControllerRequest.parse(request);

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
