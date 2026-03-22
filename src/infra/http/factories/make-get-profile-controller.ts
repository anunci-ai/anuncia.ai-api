import { Controller } from "../../../core/infra/controller";
import { GetProfileUseCase } from "../../../domain/application/use-cases/get-profile";
import { PrismaUsersRepository } from "../../prisma/repositories/prisma-users-repository";
import { GetProfileController } from "../controllers/get-profile-controller";

export function makeGetProfileController(): Controller {
  const usersRepository = new PrismaUsersRepository();
  const getProfileUseCase = new GetProfileUseCase(usersRepository);
  const getProfileController = new GetProfileController(getProfileUseCase);

  return getProfileController;
}
