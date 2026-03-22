import { prisma } from ".";
import { UnitOfWork } from "../../core/unit-of-work";
import { Prisma } from "@prisma/client";

export type PrismaTransaction = Prisma.TransactionClient;

export class PrismaUnitOfWork implements UnitOfWork {
  async execute<T>(fn: (trx: PrismaTransaction) => Promise<T>): Promise<T> {
    return prisma.$transaction(async (tx) => {
      return fn(tx);
    });
  }
}
