import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "../../../../test/repositories/in-memory-users-repository";
import { CreateAccountUseCase } from "./create-account";
import { EmailAlreadyTakenError } from "./errors/email-already-taken-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: CreateAccountUseCase;

describe("Create an account", async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new CreateAccountUseCase(inMemoryUsersRepository);
  });

  it("should be able to create an user account", async () => {
    const response = await sut.execute({ name: "John Doe", email: "john@doe.com", password: "123456" });

    expect(response.value).toEqual(expect.objectContaining({ userId: expect.any(String) }));
  });

  it("not should be able to create an user account with an email that already exists", async () => {
    await sut.execute({ name: "John Doe", email: "john@doe.com", password: "123456" });

    // teste
    const response = await sut.execute({ name: "John Smith", email: "john@doe.com", password: "123456" });

    expect(response.value).toBeInstanceOf(EmailAlreadyTakenError);
  });
});
