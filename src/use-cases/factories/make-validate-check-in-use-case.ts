import { PrimsaCheckinsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { ValidateCheckinUseCase } from "../validate-chek-in";

export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrimsaCheckinsRepository();
  const useCase = new ValidateCheckinUseCase(checkInsRepository);

  return useCase;
}
