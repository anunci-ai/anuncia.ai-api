import { Entity } from "../../../core/entities/Entity";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { Optional } from "../../../core/types/optional";

interface SubscriptionProps {
  userId: UniqueEntityId;
  planId: UniqueEntityId;
  tokensTotal: number;
  tokensRemaining: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  canceledAt?: Date;
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

  get isActive() {
    return this.props.isActive;
  }

  get canceledAt() {
    return this.props.canceledAt;
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

  static create(props: Optional<SubscriptionProps, "createdAt" | "isActive">, id?: UniqueEntityId) {
    const subscription = new Subscription(
      {
        ...props,
        isActive: props.isActive ?? true,
        createdAt: new Date(),
      },
      id,
    );

    return subscription;
  }

  public consumeTokens(amount: number): void {
    if (!this.isActive) {
      throw new Error("Assinatura inativa.");
    }

    if (this.tokensRemaining < amount) {
      throw new Error("Saldo de tokens insuficiente.");
    }

    this.props.tokensRemaining -= amount;
    this.touch();

    if (this.props.tokensRemaining <= 0) {
      this.props.tokensRemaining = 0;
      this.props.isActive = false;
    }
  }

  public cancel(): void {
    if (!this.isActive) {
      throw new Error("Assinatura já está inativa ou cancelada.");
    }

    this.props.isActive = false;
    this.props.canceledAt = new Date();
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
