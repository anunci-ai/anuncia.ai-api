import { Either, left, right } from "../../../../../core/either";
import { User } from "../../../../enterprise/entities/user";
import { Password } from "../../../../enterprise/entities/value-objects/password";
import { UsersRepository } from "../../../repositories/users-repository";
import { EmailAlreadyTakenError } from "../../_errors/email-already-taken-error";
import { CreateUserDTO } from "./create-user-dto";
import { CreateUserResponse } from "./create-user-response";

type CreateUserUseCaseResponse = Either<EmailAlreadyTakenError, CreateUserResponse>;

export class CreateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: CreateUserDTO): Promise<CreateUserUseCaseResponse> {
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
