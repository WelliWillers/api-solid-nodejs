import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gymss-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;

describe("Fetch nearby gyms use case", () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(gymsRepository);
  });

  it("should be able to fetch nearby gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym Montanha",
      description: null,
      phone: null,
      latitude: -29.4501373,
      longitude: -51.9932195,
    });

    await gymsRepository.create({
      title: "Far Gym Montanha 2",
      description: null,
      phone: null,
      latitude: -29.4690253,
      longitude: -52.0944766,
    });

    const { gyms } = await sut.execute({
      userLatitude: -29.4501373,
      userLongitude: -51.9932195,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "Near Gym Montanha" }),
    ]);
  });
});
