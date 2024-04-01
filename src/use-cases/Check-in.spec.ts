import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gymss-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CheckinUseCase } from "./check-in";

let usersRepository: InMemoryCheckinsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckinUseCase;

describe("Check-in use case", () => {
  beforeEach(() => {
    usersRepository = new InMemoryCheckinsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckinUseCase(usersRepository, gymsRepository);

    gymsRepository.items.push({
      id: "gymId-01",
      title: "GymId 01 title",
      description: "",
      phone: "",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    const { checkin } = await sut.execute({
      gymId: "gymId-01",
      userId: "userId-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkin.id).toEqual(expect.any(String));
  });

  it("should not be able to make twice check ins on the same day", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gymId-01",
      userId: "userId-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    await expect(() =>
      sut.execute({
        gymId: "gymId-01",
        userId: "userId-01",
        userLatitude: 0,
        userLongitude: 0,
      })
    ).rejects.toBeInstanceOf(Error);
  });

  it("should be able to make check in on differents days", async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gymId-01",
      userId: "userId-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

    const { checkin } = await sut.execute({
      gymId: "gymId-01",
      userId: "userId-01",
      userLatitude: 0,
      userLongitude: 0,
    });

    expect(checkin.id).toEqual(expect.any(String));
  });
});
