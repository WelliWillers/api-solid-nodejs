import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gymss-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { SearchGymUseCase } from "./search-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe("Search gym use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });

  it("should be able to search for gyms", async () => {
    await gymsRepository.create({
      title: "Star Gym Montanha",
      description: null,
      phone: null,
      latitude: -29.4501373,
      longitude: -51.9932195,
    });

    await gymsRepository.create({
      title: "Star Gym Montanha 2",
      description: null,
      phone: null,
      latitude: -29.4501373,
      longitude: -51.9932195,
    });

    const { gyms } = await sut.execute({
      query: "Star Gym",
      page: 1,
    });

    expect(gyms).toHaveLength(2);
  });

  it("should be able to fetch paginated gyms search", async () => {
    for (let index = 1; index <= 22; index++) {
      await gymsRepository.create({
        title: "Star Gym Montanha " + index,
        description: null,
        phone: null,
        latitude: -29.4501373,
        longitude: -51.9932195,
      });
    }

    const { gyms } = await sut.execute({
      query: "Star Gym",
      page: 2,
    });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Star Gym Montanha 21" }),
      expect.objectContaining({ title: "Star Gym Montanha 22" }),
    ]);
  });
});
