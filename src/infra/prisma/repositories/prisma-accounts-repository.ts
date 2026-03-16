import { Prisma } from "@prisma/client";
import { prisma } from "..";
import { AccountsRepository } from "../../../domain/application/repositories/accounts-repository";
import { Account } from "../../../domain/enterprise/entities/account";
import { AccountMapper } from "../../../domain/enterprise/mappers/account-mapper";

export class PrismaAccountsRepository implements AccountsRepository {
  async save(account: Account, trx: Prisma.TransactionClient): Promise<Account> {
    const client = trx ?? prisma;

    const raw = await client.account.create({
      data: {
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        userId: account.userId.toString(),
      },
    });

    return AccountMapper.toDomain(raw);
  }
}
