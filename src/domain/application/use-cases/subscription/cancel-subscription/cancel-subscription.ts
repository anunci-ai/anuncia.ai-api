import { Either, left, right } from "../../../../../core/either";
import { SubscriptionsRepository } from "../../../repositories/subscriptions-repository";
import { ResourceNotFoundError } from "../../_errors/resource-not-found-error";
import { CancelSubscriptionDTO } from "./cancel-subscription-dto";

type CancelSubscriptionUseCaseResponse = Either<ResourceNotFoundError | Error, null>;

export class CancelSubscriptionUseCase {
  constructor(private subscriptionsRepository: SubscriptionsRepository) {}

  async execute({ userId, subscriptionId }: CancelSubscriptionDTO): Promise<CancelSubscriptionUseCaseResponse> {
    const subscription = await this.subscriptionsRepository.findById(subscriptionId);

    if (!subscription) {
      return left(new ResourceNotFoundError());
    }

    if (subscription.userId.toString() !== userId) {
      return left(new Error("Você não tem permissão para cancelar esta assinatura."));
    }

    try {
      subscription.cancel();
      await this.subscriptionsRepository.save(subscription);
    } catch (err) {
      return left(err as Error);
    }

    return right(null);
  }
}
