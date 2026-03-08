import { Entity } from "../../../core/entitites/Entity";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";
import { Optional } from "../../../core/types/optional";

interface SubscriptionProps {
  userId: UniqueEntityId;
  planId: UniqueEntityId;
  tokensTotal: number;
  tokensRemaining: number;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Subscription extends Entity<SubscriptionProps> {
  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<SubscriptionProps, "createdAt">, id?: UniqueEntityId) {
    const subscription = new Subscription(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return subscription;
  }
}
