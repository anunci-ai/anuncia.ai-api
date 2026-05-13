import { Subscription } from "../entities/subscription";
import { Subscription as PersistenceSubscription } from "@prisma/client";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";

export class SubscriptionMapper {
  static toDomain(raw: PersistenceSubscription) {
    return Subscription.create(
      {
        userId: new UniqueEntityId(raw.userId),
        planId: new UniqueEntityId(raw.planId),
        tokensTotal: raw.tokensTotal,
        tokensRemaining: raw.tokensRemaining,
        isActive: raw.isActive,
        canceledAt: raw.canceledAt ?? undefined,
        startDate: raw.startDate ?? undefined,
        endDate: raw.endDate ?? undefined,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPersistence(subscription: Subscription): PersistenceSubscription {
    return {
      id: subscription.id.toString(),
      userId: subscription.userId.toString(),
      planId: subscription.planId.toString(),
      tokensTotal: subscription.tokensTotal,
      tokensRemaining: subscription.tokensRemaining,
      isActive: subscription.isActive,
      canceledAt: subscription.canceledAt ?? null,
      startDate: subscription.startDate ?? null,
      endDate: subscription.endDate ?? null,
      createdAt: subscription.createdAt ?? new Date(),
      updatedAt: subscription.updatedAt ?? new Date(),
    };
  }
}
