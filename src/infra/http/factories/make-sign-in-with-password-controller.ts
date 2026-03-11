import { Controller } from "../../../core/infra/controller";
import { SignInWithPasswordUseCase } from "../../../domain/application/use-cases/sign-in-with-password";
import { PrismaUsersRepository } from "../../prisma/repositories/prisma-users-repository";
import { SignInWithPasswordController } from "../controllers/sign-in-with-password-controller";

export function makeSignInWithPasswordController(): Controller {
  const usersRepository = new PrismaUsersRepository();
  const signInWithPasswordUseCase = new SignInWithPasswordUseCase(usersRepository);
  const signInWithPasswordController = new SignInWithPasswordController(signInWithPasswordUseCase);

  return signInWithPasswordController;
}
