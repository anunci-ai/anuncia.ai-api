import { sign } from "jsonwebtoken";
import { UsersRepository } from "../../../repositories/users-repository";
import { User } from "../../../../enterprise/entities/user";
import { env } from "../../../../../infra/env";
import { Either, left, right } from "../../../../../core/either";
import { InvalidGoogleIdTokenError } from "../../_errors/invalid-google-id-token-error";
import { googleClient } from "../../../../../infra/google/client";
import { AccountsRepository } from "../../../repositories/accounts-repository";
import { Account, ProviderEnum } from "../../../../enterprise/entities/account";
import { UnitOfWork } from "../../../../../core/unit-of-work";
import { SignInWithGoogleDTO } from "./sign-in-with-google-dto";
import { SignInWithGoogleResponse } from "./sign-in-with-google-response";

type SignInWithGoogleUseCaseResponse = Either<InvalidGoogleIdTokenError, SignInWithGoogleResponse>;

export class SignInWithGoogleUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private accountsRepository: AccountsRepository,
    private unitOfWork: UnitOfWork,
  ) {}

  async execute({ googleIdToken }: SignInWithGoogleDTO): Promise<SignInWithGoogleUseCaseResponse> {
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: googleIdToken,
        audience: env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email || !payload.name) {
        return left(new InvalidGoogleIdTokenError());
      }

      const { email, name, sub, picture } = payload;

      let user = await this.usersRepository.findByEmail(email);

      if (!user) {
        const newUser = User.create({
          name,
          avatarUrl: picture,
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

      const token = sign({ sub: user.id.toString() }, env.JWT_SECRET, { expiresIn: "1d" });

      return right({ token });
    } catch {
      return left(new InvalidGoogleIdTokenError());
    }
  }
}
