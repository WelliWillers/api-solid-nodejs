import { makeValidateCheckInUseCase } from "@/use-cases/factories/make-validate-check-in-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function validate(req: FastifyRequest, res: FastifyReply) {
  const validateChecInParamsSchema = z.object({
    checkInId: z.string().uuid(),
  });

  const { checkInId } = validateChecInParamsSchema.parse(req.params);

  const validateCheckInUseCase = makeValidateCheckInUseCase();

  console.log("checkInId", checkInId);

  await validateCheckInUseCase.execute({
    checkInId,
  });

  return res.status(204).send();
}
