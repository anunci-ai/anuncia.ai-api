import { Prisma } from "@prisma/client";
import { prisma } from "..";
import { UsersRepository } from "../../../domain/application/repositories/users-repository";
import { User } from "../../../domain/enterprise/entities/user";
import { UserMapper } from "../../../domain/enterprise/mappers/user-mapper";
import { ProfileData } from "../../../core/repositories/profile-data";

export class PrismaUsersRepository implements UsersRepository {
  async findByIdAndGetSubscription(id: string): Promise<ProfileData | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        subscriptions: { where: { isActive: true }, take: 1 },
      },
    });

    if (!user) {
      return null;
    }

    const activeSubscription = user.subscriptions[0];

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl ?? undefined,
      subscription: activeSubscription
        ? {
            planId: activeSubscription.planId,
            isActive: activeSubscription.isActive,
            tokensTotal: activeSubscription.tokensTotal,
            tokensRemaining: activeSubscription.tokensRemaining,
          }
        : undefined,
    };
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async save(user: User, trx: Prisma.TransactionClient): Promise<User> {
    const client = trx ?? prisma;

    const newUser = await client.user.create({
      data: {
        name: user.name,
        avatarUrl: user.avatarUrl,
        email: user.email,
        password: user.password?.value,
      },
    });

    return UserMapper.toDomain(newUser);
  }
}
