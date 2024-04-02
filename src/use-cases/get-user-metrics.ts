import { CheckinsRepository } from "@/repositories/check-ins-repository";

interface GetUserMetricUseCaseRequest {
  userId: string;
  page: number;
}

interface GetUserMetricUseCaseResponse {
  checkInsCount: number;
}

export class GetUserMetricUseCase {
  constructor(private checkInsRepository: CheckinsRepository) {}

  async execute({
    userId,
    page,
  }: GetUserMetricUseCaseRequest): Promise<GetUserMetricUseCaseResponse> {
    const checkInsCount = await this.checkInsRepository.countByUserId(userId);

    return {
      checkInsCount,
    };
  }
}
