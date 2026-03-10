import { prisma } from "..";
import { UsersRepository } from "../../../domain/application/repositories/users-repository";
import { User } from "../../../domain/enterprise/entities/user";
import { UserMapper } from "../../../domain/enterprise/mappers/user-mapper";

export class PrismaUsersRepository implements UsersRepository {
  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return null;
    }

    return UserMapper.toDomain(user);
  }

  async save(user: User): Promise<User> {
    const newUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password?.value,
      },
    });

    return UserMapper.toDomain(newUser);
  }
}
