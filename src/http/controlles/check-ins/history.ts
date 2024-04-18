import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function history(req: FastifyRequest, res: FastifyReply) {
  const checkinsHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
  });

  const { page } = checkinsHistoryQuerySchema.parse(req.query);

  const fetchUsersCheckInsHistory = makeFetchUserCheckInsHistoryUseCase();

  const { checkIns } = await fetchUsersCheckInsHistory.execute({
    userId: req.user.sub,
    page,
  });

  return res.status(200).send({ checkIns });
}
