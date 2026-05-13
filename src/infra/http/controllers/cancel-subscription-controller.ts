import { z, ZodError } from "zod";
import { Controller } from "../../../core/infra/controller";
import { CancelSubscriptionUseCase } from "../../../domain/application/use-cases/subscription/cancel-subscription/cancel-subscription";
import { HttpResponse, clientError, ok, fail } from "../../../core/infra/http-response";

const cancelSubscriptionSchema = z.object({
  subscriptionId: z.string().uuid(),
});

type CancelSubscriptionRequest = z.infer<typeof cancelSubscriptionSchema> & { userId: string };

export class CancelSubscriptionController implements Controller {
  constructor(private cancelSubscriptionUseCase: CancelSubscriptionUseCase) {}

  async handle(request: CancelSubscriptionRequest): Promise<HttpResponse> {
    try {
      const { subscriptionId } = cancelSubscriptionSchema.parse(request);
      const { userId } = request;

      const result = await this.cancelSubscriptionUseCase.execute({
        userId,
        subscriptionId,
      });

      if (result.isLeft()) {
        const error = result.value;
        return clientError(error.message);
      }

      return ok();
    } catch (err) {
      if (err instanceof ZodError) {
        return clientError(z.prettifyError(err));
      }

      return fail(new Error(String(err)));
    }
  }
}
