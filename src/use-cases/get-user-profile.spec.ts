import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { beforeEach, describe, expect, it } from "vitest";
import { ResorceNotFoundError } from "./errors/resolce-not-found-error";
import { GetUserProfileUseCase } from "./get-user-profile";

let usersRepository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;

describe("Get user profile use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(usersRepository);
  });

  it("should be able get user profile", async () => {
    const createdUser = await usersRepository.create({
      name: "Jonh Doe",
      email: "jonh@example.com",
      password_hash: await hash("123456", 6),
    });

    const { user } = await sut.execute({
      userId: createdUser.id,
    });

    expect(user.id).toEqual(expect.any(String));
    expect(user.name).toEqual("Jonh Doe");
  });

  it("should not be able to get user profile with wrong id", async () => {
    await expect(() =>
      sut.execute({
        userId: "non-existing-id",
      })
    ).rejects.toBeInstanceOf(ResorceNotFoundError);
  });
});
