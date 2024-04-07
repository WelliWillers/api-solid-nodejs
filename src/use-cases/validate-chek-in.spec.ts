import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LateCheckInValidationError } from "./errors/late-chek-in-validation-error";
import { ResorceNotFoundError } from "./errors/resolce-not-found-error";
import { ValidateCheckinUseCase } from "./validate-chek-in";

let checkInsRepository: InMemoryCheckinsRepository;
let sut: ValidateCheckinUseCase;

describe("Validate check In use case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckinsRepository();
    sut = new ValidateCheckinUseCase(checkInsRepository);

    // gymsRepository.create({
    //   id: "gymId-01",
    //   title: "GymId 01 title",
    //   description: "",
    //   phone: "",
    //   latitude: -29.4501373,
    //   longitude: -51.9932195,
    // });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to validate the check-in", async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gymId-01",
      user_id: "userId-01",
    });

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    });

    expect(checkIn.validated_at).toEqual(expect.any(Date));
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
  });

  it("should be able to validate an inexistent check-in", async () => {
    await expect(() =>
      sut.execute({
        checkInId: "inexistentCheckInId",
      })
    ).rejects.toBeInstanceOf(ResorceNotFoundError);
  });

  it("should not be able to validate the check-in after 20 minutes of this cretion", async () => {
    vi.setSystemTime(new Date(2023, 0, 1, 13, 40));

    const createdCheckIn = await checkInsRepository.create({
      gym_id: "gymId-01",
      user_id: "userId-01",
    });

    const TwentyOneMinutesInMs = 1000 * 60 * 21;

    vi.advanceTimersByTime(TwentyOneMinutesInMs);

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      })
    ).rejects.toBeInstanceOf(LateCheckInValidationError);
  });
});
