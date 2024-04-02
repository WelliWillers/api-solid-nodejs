import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gymss-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckinUseCase } from "./check-in";
import { MaxDistanceError } from "./errors/max-distance-error";
import { MaxNumberOfCheckInsError } from "./errors/max-number-of-check-ins-error";

let checkInsRepository: InMemoryCheckinsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckinUseCase;

describe("Check-in use case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckinsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckinUseCase(checkInsRepository, gymsRepository);

    gymsRepository.create({
      id: "gymId-01",
      title: "GymId 01 title",
      description: "",
      phone: "",
      latitude: -29.4501373,
      longitude: -51.9932195,
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkin } = await sut.execute({
      gymId: "gymId-01",
      userId: "userId-01",
      userLatitude: -29.4501373,
      userLongitude: -51.9932195,
    });

    expect(checkin.id).toEqual(expect.any(String));
  });

  it("should not be able to make twice check ins on the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gymId-01",
      userId: "userId-01",
      userLatitude: -29.4501373,
      userLongitude: -51.9932195,
    });

    await expect(() =>
      sut.execute({
        gymId: "gymId-01",
        userId: "userId-01",
        userLatitude: -29.4501373,
        userLongitude: -51.9932195,
      })
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to make check in on differents days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gymId-01",
      userId: "userId-01",
      userLatitude: -29.4501373,
      userLongitude: -51.9932195,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkin } = await sut.execute({
      gymId: "gymId-01",
      userId: "userId-01",
      userLatitude: -29.4501373,
      userLongitude: -51.9932195,
    });

    expect(checkin.id).toEqual(expect.any(String));
  });

  it("should not be able to check in distant of the gym", async () => {
    gymsRepository.items.push({
      id: "gymId-02",
      title: "GymId 02 title",
      description: "",
      phone: "",
      latitude: new Decimal(-29.4501373),
      longitude: new Decimal(-51.9932195),
    });

    await expect(() =>
      sut.execute({
        gymId: "gymId-01",
        userId: "userId-01",
        userLatitude: -29.4573692,
        userLongitude: -51.9990295,
      })
    ).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
