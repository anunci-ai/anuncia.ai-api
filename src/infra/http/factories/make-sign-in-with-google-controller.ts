import { PrismaUsersRepository } from "../../prisma/repositories/prisma-users-repository";
import { SignInWithGoogleUseCase } from "../../../domain/application/use-cases/sign-in-with-google";
import { SignInWithGoogleController } from "../controllers/sign-in-with-google-controller";
import { Controller } from "../../../core/infra/controller";

export function makeSignInWithGoogleController(): Controller {
  const prismaUsersRepository = new PrismaUsersRepository();
  const authenticateWithGoogleUseCase = new SignInWithGoogleUseCase(prismaUsersRepository);
  const authenticateWithGoogleController = new SignInWithGoogleController(authenticateWithGoogleUseCase);

  return authenticateWithGoogleController;
}
