import { User } from "../entities/user";
import { User as PersistenceUser } from "../../../../generated/prisma/client";
import { UniqueEntityId } from "../../../core/entitites/unique-entity-id";
import { Password } from "../entities/value-objects/password";

export class UserMapper {
  static toDomain(raw: PersistenceUser) {
    return User.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password ? Password.create(raw.password) : undefined,
        createdAt: raw.createdAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPersistence(user: User): PersistenceUser {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      password: user.password ? user.password?.toString() : null,
      createdAt: user.createdAt ?? new Date(),
    };
  }
}
