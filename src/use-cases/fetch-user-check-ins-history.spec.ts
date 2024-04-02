import { InMemoryCheckinsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { beforeEach, describe, expect, it } from "vitest";
import { FetchUserCheckinsHistoryUseCase } from "./fetch-user-check-ins-history";

let checkInsRepository: InMemoryCheckinsRepository;
let sut: FetchUserCheckinsHistoryUseCase;

describe("Fetch user check-ins history use case", () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckinsRepository();
    sut = new FetchUserCheckinsHistoryUseCase(checkInsRepository);
  });

  it("should be able to fetch check in history", async () => {
    await checkInsRepository.create({
      gym_id: "gym-01",
      user_id: "userId-01",
    });

    await checkInsRepository.create({
      gym_id: "gym-02",
      user_id: "userId-01",
    });

    const { checkIns } = await sut.execute({
      userId: "userId-01",
      page: 1,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-01" }),
      expect.objectContaining({ gym_id: "gym-02" }),
    ]);
  });

  it("should be able to fetch paginated check in history", async () => {
    for (let index = 1; index <= 22; index++) {
      await checkInsRepository.create({
        gym_id: `gym-${index}`,
        user_id: "userId-01",
      });
    }

    const { checkIns } = await sut.execute({
      userId: "userId-01",
      page: 2,
    });

    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
