import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { compare } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { UserAlredyExists } from "./errors/user-alredy-exists-error";
import { RegisterUseCase } from "./register";

let usersRepository: InMemoryUsersRepository;
let sut: RegisterUseCase;

describe("Register use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new RegisterUseCase(usersRepository);
  });

  it("should hash user password upon registration", async () => {
    const { user } = await sut.execute({
      name: "Jonh Doe",
      email: "jonh@example.com",
      password: "1234567890",
    });

    const isPasswordCorrectHashed = await compare(
      "1234567890",
      user.password_hash
    );

    expect(isPasswordCorrectHashed).toBeTruthy();
  });

  it("should not be able register user with same email in table", async () => {
    const email = "jonh@example.com";

    await sut.execute({
      name: "Jonh Doe",
      email,
      password: "1234567890",
    });

    await expect(() =>
      sut.execute({
        name: "Jonh Doe",
        email,
        password: "1234567890",
      })
    ).rejects.toBeInstanceOf(UserAlredyExists);
  });

  it("should be able to register", async () => {
    const { user } = await sut.execute({
      name: "Jonh Doe",
      email: "jonh@example.com",
      password: "1234567890",
    });

    expect(user.id).toEqual(expect.any(String));
  });
});
