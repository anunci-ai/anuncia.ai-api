import { Either, left, right } from "../../../../../core/either";
import { UsersRepository } from "../../../repositories/users-repository";
import { ResourceNotFoundError } from "../../_errors/resource-not-found-error";
import { GetProfileResponse } from "./get-profile-response";
import { GetProfileDTO } from "./get-profle-dto";

type GetProfileUseCaseResponse = Either<ResourceNotFoundError, GetProfileResponse>;

export class GetProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ userId }: GetProfileDTO): Promise<GetProfileUseCaseResponse> {
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
