import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gymss-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { CreateGymUseCase } from "./create-gym";

let gymdRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Create gym use case", () => {
  beforeEach(() => {
    gymdRepository = new InMemoryGymsRepository();
    sut = new CreateGymUseCase(gymdRepository);
  });

  it("should be able to create new gym", async () => {
    const { gym } = await sut.execute({
      title: "Star Gym Montanha",
      description: null,
      phone: null,
      latitude: -29.4501373,
      longitude: -51.9932195,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
