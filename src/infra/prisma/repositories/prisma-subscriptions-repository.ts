import { prisma } from "..";
import { SubscriptionsRepository } from "../../../domain/application/repositories/subscriptions-repository";
import { Subscription } from "../../../domain/enterprise/entities/subscription";
import { SubscriptionMapper } from "../../../domain/enterprise/mappers/subscription-mapper";

export class PrismaSubscriptionsRepository implements SubscriptionsRepository {
  async findByUserId(userId: string): Promise<Subscription | null> {
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
      },
    });

    if (!subscription) {
      return null;
    }

    return SubscriptionMapper.toDomain(subscription);
  }

  async save(subscription: Subscription): Promise<void> {
    const data = SubscriptionMapper.toPersistence(subscription);

    await prisma.subscription.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
