import { Account, ProviderEnum } from "../entities/account";
import { Account as PersistenceAccount } from "../../../../generated/prisma/client";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";

export class AccountMapper {
  static toDomain(raw: PersistenceAccount) {
    return Account.create(
      {
        userId: new UniqueEntityId(raw.userId),
        provider: raw.provider as ProviderEnum,
        providerAccountId: raw.providerAccountId,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPersistence(account: Account): PersistenceAccount {
    return {
      id: account.id.toString(),
      userId: account.userId.toString(),
      provider: account.provider,
      providerAccountId: account.providerAccountId,
      createdAt: account.createdAt ?? new Date(),
    };
  }
}
