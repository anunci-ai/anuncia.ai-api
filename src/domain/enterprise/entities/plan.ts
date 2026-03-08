import { Entity } from "../../../core/entitites/Entity";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";
import { Optional } from "../../../core/types/optional";

interface PlanProps {
  name: string;
  priceInCents: number;
  tokensQuantity: number;
  createdAt?: Date;
}

export class Plan extends Entity<PlanProps> {
  static create(props: Optional<PlanProps, "createdAt">, id?: UniqueEntityId) {
    const plan = new Plan(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    );

    return plan;
  }
}
