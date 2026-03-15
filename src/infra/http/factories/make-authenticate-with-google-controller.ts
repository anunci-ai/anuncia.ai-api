import { AuthenticateWithGoogleUseCase } from "../../../domain/application/use-cases/authenticate-with-google";
import { PrismaUsersRepository } from "../../prisma/repositories/prisma-users-repository";
import { AuthenticateWithGoogleController } from "../controllers/authenticate-with-google-controller";

export function makeAuthenticateWithGoogleController() {
  // 1. Instanciamos o repositório real que fala com o PostgreSQL via Prisma
  const prismaUsersRepository = new PrismaUsersRepository();

  // 2. Injetamos o repositório no nosso Caso de Uso
  const authenticateWithGoogleUseCase = new AuthenticateWithGoogleUseCase(prismaUsersRepository);

  // 3. Injetamos o Caso de Uso no Controlador HTTP
  const authenticateWithGoogleController = new AuthenticateWithGoogleController(authenticateWithGoogleUseCase);

  // 4. Devolvemos o controlador montado e pronto para a rota
  return authenticateWithGoogleController;
}
