import { CheckinsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gym-repositoriy";
import { CheckIn } from "@prisma/client";
import { ResorceNotFoundError } from "./errors/resolce-not-found-error";

interface CheckinUseCaseRequest {
  userId: string;
  gymId: string;
  userLatitude: number;
  userLongitude: number;
}

interface CheckinUseCaseResponse {
  checkin: CheckIn;
}

export class CheckinUseCase {
  constructor(
    private checkinsRepository: CheckinsRepository,
    private gymsRepository: GymsRepository
  ) {}

  async execute({
    gymId,
    userId,
  }: CheckinUseCaseRequest): Promise<CheckinUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId);

    if (!gym) {
      throw new ResorceNotFoundError();
    }

    const checkinOnSameDay = await this.checkinsRepository.findByUserIdOnDate(
      userId,
      new Date()
    );

    if (checkinOnSameDay) {
      throw new Error();
    }

    const checkin = await this.checkinsRepository.create({
      gym_id: gymId,
      user_id: userId,
    });

    return {
      checkin,
    };
  }
}
