import { Controller } from "../../../core/infra/controller";
import { CreateAccountUseCase } from "../../../domain/application/use-cases/create-account";
import { PrismaUsersRepository } from "../../prisma/repositories/prisma-users-repository";
import { CreateAccountController } from "../controllers/create-account-controller";

export function makeCreateAccountController(): Controller {
  const usersRepository = new PrismaUsersRepository();
  const createAccountUseCase = new CreateAccountUseCase(usersRepository);
  const createAccountController = new CreateAccountController(createAccountUseCase);

  return createAccountController;
}
