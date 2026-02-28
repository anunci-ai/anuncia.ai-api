import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "../../../../test/repositories/in-memory-users-repository";
import { SignInWithPasswordUseCase } from "./sign-in-with-password";
import { User } from "../../enterprise/entities/user";
import { Password } from "../../enterprise/entities/value-objects/password";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: SignInWithPasswordUseCase;

describe("Create an account", async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new SignInWithPasswordUseCase(inMemoryUsersRepository);
  });

  it("should be able to sign in with password", async () => {
    const newUser = User.create({
      name: "Thomas Jefferson",
      email: "thoms@jefferson.com",
      password: await Password.generateHashFromPlainText("123456", 8),
    });

    await inMemoryUsersRepository.save(newUser);

    const response = await sut.execute({ email: "thoms@jefferson.com", password: "123456" });

    expect(response).toEqual(expect.objectContaining({ token: expect.any(String) }));
  });
});
