import { sign } from "jsonwebtoken";
import { Password } from "../../enterprise/entities/value-objects/password";
import { UsersRepository } from "../repositories/users-repository";

interface SignInWithPasswordUseCaseRequest {
  email: string;
  password: string;
}

interface SignInWithPasswordUseCaseResponse {
  token: string;
}

export class SignInWithPasswordUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ email, password }: SignInWithPasswordUseCaseRequest): Promise<SignInWithPasswordUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new Error("E-mail ou senha incorreto.");
    }

    const userPasswordHash = user.password?.toString();

    const passwordMatch = await Password.isValid(password, userPasswordHash!);

    if (!passwordMatch) {
      throw new Error("E-mail ou senha incorreto.");
    }

    const token = sign({ sub: user.id.toString() }, process.env.JWT_SECRET!, { expiresIn: "1d" });

    return {
      token,
    };
  }
}
