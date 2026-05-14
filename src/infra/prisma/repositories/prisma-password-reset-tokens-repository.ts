import { prisma } from "..";
import {
  PasswordResetTokenData,
  PasswordResetTokensRepository,
} from "../../../domain/application/repositories/password-reset-tokens-repository";

export class PrismaPasswordResetTokensRepository implements PasswordResetTokensRepository {
  async create({ userId, token, expiresAt }: { userId: string; token: string; expiresAt: Date }): Promise<void> {
    await prisma.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findByToken(token: string): Promise<PasswordResetTokenData | null> {
    const passwordResetToken = await prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
    });

    if (!passwordResetToken) {
      return null;
    }

    return {
      id: passwordResetToken.id,
      token: passwordResetToken.token,
      userId: passwordResetToken.userId,
      expiresAt: passwordResetToken.expiresAt,
      createdAt: passwordResetToken.createdAt,
    };
  }

  async deleteById(id: string): Promise<void> {
    await prisma.passwordResetToken.delete({
      where: {
        id,
      },
    });
  }
}
