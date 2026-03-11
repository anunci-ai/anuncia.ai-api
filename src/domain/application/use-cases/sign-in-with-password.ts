import { sign } from "jsonwebtoken";
import { Password } from "../../enterprise/entities/value-objects/password";
import { UsersRepository } from "../repositories/users-repository";
import { env } from "../../../infra/env";
import { InvalidEmailOrPasswordError } from "./errors/invalid-email-or-password-error";
import { Either, left, right } from "../../../core/either";

type TokenResponse = {
  token: string;
};

type SignInWithPasswordUseCaseRequest = {
  email: string;
  password: string;
};

type SignInWithPasswordUseCaseResponse = Either<InvalidEmailOrPasswordError, TokenResponse>;

export class SignInWithPasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: SignInWithPasswordUseCaseRequest): Promise<SignInWithPasswordUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new InvalidEmailOrPasswordError());
    }

    const userPasswordHash = user.password?.toString();

    const passwordMatch = await Password.isValid(password, userPasswordHash!);

    if (!passwordMatch.value) {
      return left(new InvalidEmailOrPasswordError());
    }

    const token = sign({ sub: user.id.toString() }, env.JWT_SECRET, { expiresIn: "1d" });

    return right({ token });
  }
}
