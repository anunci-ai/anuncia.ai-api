import { Controller } from "../../../core/infra/controller";
import { PrismaSubscriptionsRepository } from "../../prisma/repositories/prisma-subscriptions-repository";
import { CancelSubscriptionUseCase } from "../../../domain/application/use-cases/subscription/cancel-subscription/cancel-subscription";
import { CancelSubscriptionController } from "../controllers/cancel-subscription-controller";

export function makeCancelSubscriptionController(): Controller {
  const subscriptionsRepository = new PrismaSubscriptionsRepository();
  const cancelSubscriptionUseCase = new CancelSubscriptionUseCase(subscriptionsRepository);
  const cancelSubscriptionController = new CancelSubscriptionController(cancelSubscriptionUseCase);

  return cancelSubscriptionController;
}
