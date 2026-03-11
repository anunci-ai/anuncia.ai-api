import { Either, left, right } from "../../../core/either";
import { User } from "../../enterprise/entities/user";
import { Password } from "../../enterprise/entities/value-objects/password";
import { UsersRepository } from "../repositories/users-repository";
import { EmailAlreadyTakenError } from "./errors/email-already-taken-error";

type CreateAccountResponse = {
  userId: string;
};

type CreateAccountUseCaseRequest = {
  name: string;
  email: string;
  password: string;
};

type CreateAccountUseCaseResponse = Either<EmailAlreadyTakenError, CreateAccountResponse>;

export class CreateAccountUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const isEmailAlreadyInUse = await this.usersRepository.findByEmail(email);

    if (isEmailAlreadyInUse) {
      return left(new EmailAlreadyTakenError());
    }

    const passwordHash = await Password.generateHashFromPlainText(password, 8);

    const newUser = User.create({ name, email, password: passwordHash });

    const user = await this.usersRepository.save(newUser);

    return right({
      userId: user.id.toString(),
    });
  }
}
