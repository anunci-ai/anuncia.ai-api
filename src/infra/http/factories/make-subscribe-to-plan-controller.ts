import { Controller } from "../../../core/infra/controller";
import { PrismaPlansRepository } from "../../prisma/repositories/prisma-plans-repository";
import { PrismaSubscriptionsRepository } from "../../prisma/repositories/prisma-subscriptions-repository";
import { SubscribeToPlanUseCase } from "../../../domain/application/use-cases/subscription/subscribe-to-plan/subscribe-to-plan";
import { SubscribeToPlanController } from "../controllers/subscribe-to-plan-controller";

export function makeSubscribeToPlanController(): Controller {
  const subscriptionsRepository = new PrismaSubscriptionsRepository();
  const plansRepository = new PrismaPlansRepository();
  const subscribeToPlanUseCase = new SubscribeToPlanUseCase(subscriptionsRepository, plansRepository);
  const subscribeToPlanController = new SubscribeToPlanController(subscribeToPlanUseCase);

  return subscribeToPlanController;
}
