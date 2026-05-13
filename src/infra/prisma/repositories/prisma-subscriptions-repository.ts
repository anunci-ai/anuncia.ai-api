import { Prisma } from "@prisma/client";
import { prisma } from "..";
import { SubscriptionsRepository } from "../../../domain/application/repositories/subscriptions-repository";
import { Subscription } from "../../../domain/enterprise/entities/subscription";
import { SubscriptionMapper } from "../../../domain/enterprise/mappers/subscription-mapper";

export class PrismaSubscriptionsRepository implements SubscriptionsRepository {
  async findById(id: string): Promise<Subscription | null> {
    const subscription = await prisma.subscription.findUnique({
      where: {
        id,
      },
    });

    if (!subscription) {
      return null;
    }

    return SubscriptionMapper.toDomain(subscription);
  }

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

  async create(subscription: Subscription): Promise<void> {
    const data = SubscriptionMapper.toPersistence(subscription);

    await prisma.subscription.create({
      data,
    });
  }

  async save(subscription: Subscription, trx: Prisma.TransactionClient): Promise<void> {
    const client = trx ?? prisma;

    const data = SubscriptionMapper.toPersistence(subscription);

    await client.subscription.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
