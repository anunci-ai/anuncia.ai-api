import { Controller } from "../../../core/infra/controller";
import { PrismaUsersRepository } from "../../prisma/repositories/prisma-users-repository";
import { PrismaPasswordResetTokensRepository } from "../../prisma/repositories/prisma-password-reset-tokens-repository";
import { ResetPasswordUseCase } from "../../../domain/application/use-cases/user/reset-password/reset-password";
import { ResetPasswordController } from "../controllers/reset-password-controller";

export function makeResetPasswordController(): Controller {
  const usersRepository = new PrismaUsersRepository();
  const passwordResetTokensRepository = new PrismaPasswordResetTokensRepository();

  const useCase = new ResetPasswordUseCase(usersRepository, passwordResetTokensRepository);

  return new ResetPasswordController(useCase);
}
