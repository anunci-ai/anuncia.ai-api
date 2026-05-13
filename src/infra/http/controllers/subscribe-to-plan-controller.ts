import { z, ZodError } from "zod";
import { Controller } from "../../../core/infra/controller";
import { SubscribeToPlanUseCase } from "../../../domain/application/use-cases/subscription/subscribe-to-plan/subscribe-to-plan";
import { HttpResponse, clientError, created, fail } from "../../../core/infra/http-response";
import { UserAlreadySubscribedError } from "../../../domain/application/use-cases/_errors/user-already-subscribed-error";

const subscribeToPlanSchema = z.object({
  userId: z.uuid(),
  planId: z.uuid(),
});

type SubscribeToPlanRequest = z.infer<typeof subscribeToPlanSchema>;

export class SubscribeToPlanController implements Controller {
  constructor(private subscribeToPlanUseCase: SubscribeToPlanUseCase) {}

  async handle(request: SubscribeToPlanRequest): Promise<HttpResponse> {
    try {
      const { userId, planId } = subscribeToPlanSchema.parse(request);

      const result = await this.subscribeToPlanUseCase.execute({
        userId,
        planId,
      });

      if (result.isLeft()) {
        const error = result.value;

        if (error instanceof UserAlreadySubscribedError) {
          return clientError(error.message);
        }

        return clientError(error.message);
      }

      return created();
    } catch (err) {
      if (err instanceof ZodError) {
        return clientError(z.prettifyError(err));
      }

      return fail(new Error(String(err)));
    }
  }
}
