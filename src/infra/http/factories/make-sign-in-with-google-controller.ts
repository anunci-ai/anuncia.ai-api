import { PrismaUsersRepository } from "../../prisma/repositories/prisma-users-repository";
import { SignInWithGoogleUseCase } from "../../../domain/application/use-cases/sign-in-with-google";
import { SignInWithGoogleController } from "../controllers/sign-in-with-google-controller";
import { Controller } from "../../../core/infra/controller";
import { PrismaAccountsRepository } from "../../prisma/repositories/prisma-accounts-repository";
import { PrismaUnitOfWork } from "../../prisma/prisma-unit-of-work";

export function makeSignInWithGoogleController(): Controller {
  const prismaUsersRepository = new PrismaUsersRepository();
  const accountsRepository = new PrismaAccountsRepository();
  const unitOfWork = new PrismaUnitOfWork();
  const authenticateWithGoogleUseCase = new SignInWithGoogleUseCase(
    prismaUsersRepository,
    accountsRepository,
    unitOfWork,
  );
  const authenticateWithGoogleController = new SignInWithGoogleController(authenticateWithGoogleUseCase);

  return authenticateWithGoogleController;
}
