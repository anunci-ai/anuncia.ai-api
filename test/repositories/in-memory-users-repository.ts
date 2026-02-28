import { UsersRepository } from "../../src/domain/application/repositories/users-repository";
import { User } from "../../src/domain/enterprise/entities/user";

export class InMemoryUsersRepository implements UsersRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async save(user: User): Promise<User> {
    this.users.push(user);

    return user;
  }
}
