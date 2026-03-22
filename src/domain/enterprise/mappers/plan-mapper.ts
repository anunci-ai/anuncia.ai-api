import { Plan } from "../entities/plan";
import { Plan as PersistencePlan } from "@prisma/client";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";

export class PlanMapper {
  static toDomain(raw: PersistencePlan) {
    return Plan.create(
      {
        name: raw.name,
        priceInCents: raw.priceInCents,
        tokensQuantity: raw.tokensQuantity,
        createdAt: raw.createdAt ?? new Date(),
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPersistence(plan: Plan): PersistencePlan {
    return {
      id: plan.id.toString(),
      name: plan.name,
      priceInCents: plan.priceInCents,
      tokensQuantity: plan.tokensQuantity,
      createdAt: plan.createdAt ?? new Date(),
    };
  }
}
