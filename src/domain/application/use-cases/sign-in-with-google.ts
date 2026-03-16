import { sign } from "jsonwebtoken";
import { UsersRepository } from "../repositories/users-repository";
import { User } from "../../enterprise/entities/user";
import { env } from "../../../infra/env";
import { Either, left, right } from "../../../core/either";
import { InvalidGoogleIdTokenError } from "./errors/InvalidGoogleIdTokenError";
import { googleClient } from "../../../infra/google/client";
import { AccountsRepository } from "../repositories/accounts-repository";
import { Account, ProviderEnum } from "../../enterprise/entities/account";
import { UnitOfWork } from "../../../core/unit-of-work";

type TokenResponse = {
  token: string;
};

type SignInWithGoogleUseCaseRequest = {
  googleIdToken: string;
};

type SignInWithGoogleUseCaseResponse = Either<InvalidGoogleIdTokenError, TokenResponse>;

export class SignInWithGoogleUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private accountsRepository: AccountsRepository,
    private unitOfWork: UnitOfWork,
  ) {}

  async execute({ googleIdToken }: SignInWithGoogleUseCaseRequest): Promise<SignInWithGoogleUseCaseResponse> {
    try {
      // 1. Validar o token recebido do Front-end com os servidores do Google
      const ticket = await googleClient.verifyIdToken({
        idToken: googleIdToken,
        audience: env.GOOGLE_CLIENT_ID,
      });

      // 2. Extrair os dados do perfil do Google
      const payload = ticket.getPayload();

      if (!payload || !payload.email || !payload.name) {
        return left(new InvalidGoogleIdTokenError());
      }

      const { email, name, sub } = payload;

      // 3. Verificar se o utilizador já existe na nossa base de dados
      let user = await this.usersRepository.findByEmail(email);

      // 4. Se não existir, fazemos a inserção automática (primeiro acesso)
      if (!user) {
        const newUser = User.create({
          name,
          email,
        });

        user = await this.unitOfWork.execute(async (trx) => {
          const createdUser = await this.usersRepository.save(newUser, trx);

          const newAccount = Account.create({
            provider: "GOOGLE" as ProviderEnum,
            providerAccountId: sub,
            userId: createdUser.id,
          });

          await this.accountsRepository.save(newAccount, trx);

          return createdUser;
        });
      }

      // 5. Gerar o token JWT da nossa API para o Front-end prosseguir
      const token = sign({ sub: user.id.toString() }, env.JWT_SECRET, { expiresIn: "1d" });

      return right({ token });
    } catch {
      // Se a biblioteca do Google atirar um erro (token falso, expirado, etc), caímos aqui
      return left(new InvalidGoogleIdTokenError());
    }
  }
}
