import { SignInWithPasswordUseCase } from "../../../domain/application/use-cases/sign-in-with-password";
import { PrismaUsersRepository } from "../../prisma/repositories/prisma-users-repository";
import { SignInWithPasswordController } from "../controllers/sign-in-with-password-controller";

export function makeSignInWithPasswordController() {
  const usersRepository = new PrismaUsersRepository();
  const signInWithPasswordUseCase = new SignInWithPasswordUseCase(usersRepository);
  const signInWithPasswordController = new SignInWithPasswordController(signInWithPasswordUseCase);

  return signInWithPasswordController;
}
