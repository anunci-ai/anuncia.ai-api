import type { StringValue } from "ms";
import { sign } from "jsonwebtoken";
import { Password } from "../../../../enterprise/entities/value-objects/password";
import { UsersRepository } from "../../../repositories/users-repository";
import { env } from "../../../../../infra/env";
import { InvalidEmailOrPasswordError } from "../../_errors/invalid-email-or-password-error";
import { Either, left, right } from "../../../../../core/either";
import { SignInWithPasswordDTO } from "./sign-in-with-password-dto";
import { SignInWithPasswordResponse } from "./sign-in-with-password-response";

type SignInWithPasswordUseCaseResponse = Either<InvalidEmailOrPasswordError, SignInWithPasswordResponse>;

export class SignInWithPasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: SignInWithPasswordDTO): Promise<SignInWithPasswordUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      return left(new InvalidEmailOrPasswordError());
    }

    const userPasswordHash = user.password?.toString();

    const passwordMatch = await Password.isValid(password, userPasswordHash!);

    if (!passwordMatch.value) {
      return left(new InvalidEmailOrPasswordError());
    }

    const token = sign({ sub: user.id.toString() }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as StringValue });

    return right({ token });
  }
}
