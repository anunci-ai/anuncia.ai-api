import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryUsersRepository } from "../../../../../../test/repositories/in-memory-users-repository";
import { CreateUserUseCase } from "./create-user";
import { EmailAlreadyTakenError } from "../../_errors/email-already-taken-error";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: CreateUserUseCase;

describe("Create an user", async () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create an user user", async () => {
    const response = await sut.execute({ name: "John Doe", email: "john@doe.com", password: "123456" });

    expect(response.value).toEqual(expect.objectContaining({ userId: expect.any(String) }));
  });

  it("not should be able to create an user user with an email that already exists", async () => {
    await sut.execute({ name: "John Doe", email: "john@doe.com", password: "123456" });

    // teste
    const response = await sut.execute({ name: "John Smith", email: "john@doe.com", password: "123456" });

    expect(response.value).toBeInstanceOf(EmailAlreadyTakenError);
  });
});
