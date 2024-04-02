import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { GetUserMetricUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckinsRepository;
let sut: GetUserMetricUseCase;

describe("Get user metrics use case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckinsRepository();
    sut = new GetUserMetricUseCase(checkInsRepository);
  });

  it("should be able to get user metrics checkins count", async () => {
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "userId-01",
    });

    await checkInsRepository.create({
      gym_id: "gym-02",
      user_id: "userId-01",
    });

    const { checkInsCount } = await sut.execute({
      userId: "userId-01",
      page: 1,
    });

    expect(checkInsCount).toEqual(2);
  });
});
