import { Controller } from "../../../core/infra/controller";
import { PrismaUsersRepository } from "../../prisma/repositories/prisma-users-repository";
import { PrismaPasswordResetTokensRepository } from "../../prisma/repositories/prisma-password-reset-tokens-repository";
import { ResendMailProvider } from "../../providers/resend-mail-provider";
import { RequestPasswordResetUseCase } from "../../../domain/application/use-cases/user/request-password-reset/request-password-reset";
import { RequestPasswordResetController } from "../controllers/request-password-reset-controller";

export function makeRequestPasswordResetController(): Controller {
  const usersRepository = new PrismaUsersRepository();
  const passwordResetTokensRepository = new PrismaPasswordResetTokensRepository();
  const mailProvider = new ResendMailProvider();

  const useCase = new RequestPasswordResetUseCase(usersRepository, passwordResetTokensRepository, mailProvider);

  return new RequestPasswordResetController(useCase);
}
