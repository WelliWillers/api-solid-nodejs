import { PrimsaCheckinsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUserCheckinsHistoryUseCase } from "../fetch-user-check-ins-history";

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInsRepository = new PrimsaCheckinsRepository();
  const useCase = new FetchUserCheckinsHistoryUseCase(checkInsRepository);

  return useCase;
}
