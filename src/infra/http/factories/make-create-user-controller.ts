import { Controller } from "../../../core/infra/controller";
import { CreateUserUseCase } from "../../../domain/application/use-cases/user/create-user/create-user";
import { PrismaUsersRepository } from "../../prisma/repositories/prisma-users-repository";
import { CreateUserController } from "../controllers/create-account-controller";

export function makeCreateUserController(): Controller {
  const usersRepository = new PrismaUsersRepository();
  const createUserUseCase = new CreateUserUseCase(usersRepository);
  const createUserController = new CreateUserController(createUserUseCase);

  return createUserController;
}
