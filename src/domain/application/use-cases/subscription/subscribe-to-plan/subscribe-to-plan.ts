import { Either, left, right } from "../../../../../core/either";
import { UniqueEntityId } from "../../../../../core/entities/unique-entity-id";
import { Subscription } from "../../../../enterprise/entities/subscription";
import { PlansRepository } from "../../../repositories/plans-repository";
import { SubscriptionsRepository } from "../../../repositories/subscriptions-repository";
import { ResourceNotFoundError } from "../../_errors/resource-not-found-error";
import { UserAlreadySubscribedError } from "../../_errors/user-already-subscribed-error";
import { SubscribeToPlanDTO } from "./subscribe-to-plan-dto";

type SubscribeToPlanUseCaseResponse = Either<ResourceNotFoundError | UserAlreadySubscribedError, null>;

export class SubscribeToPlanUseCase {
  constructor(
    private subscriptionsRepository: SubscriptionsRepository,
    private plansRepository: PlansRepository,
  ) {}

  async execute({ userId, planId }: SubscribeToPlanDTO): Promise<SubscribeToPlanUseCaseResponse> {
    const existingSubscription = await this.subscriptionsRepository.findByUserId(userId);

    const plan = await this.plansRepository.findById(planId);

    if (!plan) {
      return left(new ResourceNotFoundError());
    }

    // Regra da trava: Se já tem assinatura E o plano for o grátis (0 cents), bloqueia.
    if (existingSubscription && plan.priceInCents === 0) {
      return left(new UserAlreadySubscribedError());
    }

    const subscription = Subscription.create({
      userId: new UniqueEntityId(userId),
      planId: new UniqueEntityId(planId),
      tokensTotal: plan.tokensQuantity,
      tokensRemaining: plan.tokensQuantity,
      isActive: true,
    });

    await this.subscriptionsRepository.create(subscription);

    return right(null);
  }
}
