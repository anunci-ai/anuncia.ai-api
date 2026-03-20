import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "../../../../test/repositories/in-memory-users-repository";
import { GetProfileUseCase } from "./get-profile";
import { User } from "../../enterprise/entities/user";
import { Password } from "../../enterprise/entities/value-objects/password";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetProfileUseCase;

describe("Get user profile data", async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new GetProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to get the user profile data", async () => {
    const newUser = User.create({
      name: "usuário-1",
      email: "usuario-1@email.com",
      password: await Password.generateHashFromPlainText("123456", 8),
    });

    await inMemoryUsersRepository.save(newUser);

    const response = await sut.execute({ userId: newUser.id.toString() });

    expect(response.value).toEqual(
      expect.objectContaining({
        user: { id: expect.any(String), name: expect.any(String), email: expect.any(String) },
      }),
    );
  });
});
