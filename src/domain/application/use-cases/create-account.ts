import { User } from "../../enterprise/entities/user";
import { Password } from "../../enterprise/entities/value-objects/password";
import { UsersRepository } from "../repositories/users-repository";

interface CreateAccountUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

interface CreateAccountUseCaseResponse {
  userId: string;
}

export class CreateAccountUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const isEmailAlreadyInUse = await this.usersRepository.findByEmail(email);

    if (isEmailAlreadyInUse) {
      throw new Error("Endereço de e-mail já está em uso.");
    }

    const passwordHash = await Password.generateHashFromPlainText(password, 8);

    const newUser = User.create({ name, email, password: passwordHash });

    const user = await this.usersRepository.save(newUser);

    return {
      userId: user.id.toString(),
    };
  }
}
