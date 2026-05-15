import { prisma } from "..";
import { PlansRepository } from "../../../domain/application/repositories/plans-repository";
import { Plan } from "../../../domain/enterprise/entities/plan";
import { UniqueEntityId } from "../../../core/entities/unique-entity-id";
import { PlanMapper } from "../../../domain/enterprise/mappers/plan-mapper";

export class PrismaPlansRepository implements PlansRepository {
  async findAll(): Promise<Plan[]> {
    const plans = await prisma.plan.findMany();

    return plans.map((plan) => PlanMapper.toDomain(plan));
  }

  async findByName(name: string): Promise<Plan | null> {
    const plan = await prisma.plan.findFirst({
      where: {
        name,
      },
    });

    if (!plan) {
      return null;
    }

    return Plan.create(
      {
        name: plan.name,
        priceInCents: plan.priceInCents,
        tokensQuantity: plan.tokensQuantity,
        createdAt: plan.createdAt,
      },
      new UniqueEntityId(plan.id),
    );
  }

  async findById(id: string): Promise<Plan | null> {
    const plan = await prisma.plan.findUnique({
      where: {
        id,
      },
    });

    if (!plan) {
      return null;
    }

    return Plan.create(
      {
        name: plan.name,
        priceInCents: plan.priceInCents,
        tokensQuantity: plan.tokensQuantity,
        createdAt: plan.createdAt,
      },
      new UniqueEntityId(plan.id),
    );
  }
}
