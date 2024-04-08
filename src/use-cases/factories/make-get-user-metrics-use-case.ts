import { PrimsaCheckinsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { GetUserMetricUseCase } from "../get-user-metrics";

export function makeGetUserMetricsUseCase() {
  const checkInsRepository = new PrimsaCheckinsRepository();
  const useCase = new GetUserMetricUseCase(checkInsRepository);

  return useCase;
}
