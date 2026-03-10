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
  get userId() {
    return this.props.userId;
  }

  get planId() {
    return this.props.planId;
  }

  get tokensTotal() {
    return this.props.tokensTotal;
  }

  get tokensRemaining() {
    return this.props.tokensRemaining;
  }

  get startDate() {
    return this.props.startDate;
  }

  get endDate() {
    return this.props.endDate;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get tokensUsed() {
    return this.props.tokensTotal - this.props.tokensRemaining;
  }

  get tokensUsedPercentage() {
    return (this.tokensUsed / this.tokensTotal) * 100;
  }

  get tokensUsedPercentageFormatted() {
    return `${this.tokensUsedPercentage.toFixed(2)}%`;
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
