import { Either, left, right } from "../../../core/either";
import { UsersRepository } from "../repositories/users-repository";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

type GetProfileUseCaseRequest = {
  userId: string;
};
type GetProfileUseCaseResponse = Either<ResourceNotFoundError, { user: { id: string; name: string; email: string } }>;

export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: GetProfileUseCaseRequest): Promise<GetProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError("Usuário não encontrado."));
    }

    return right({
      user: {
        id: user.id.toString(),
        name: user.name,
        avatarUrl: user.avatarUrl,
        email: user.email,
      },
    });
  }
}
