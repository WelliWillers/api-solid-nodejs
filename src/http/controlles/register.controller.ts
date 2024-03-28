import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UserAlredyExists } from "@/use-cases/errors/user-alredy-exists-error";
import { RegisterUseCase } from "@/use-cases/register";

// S O L I D
// D - inverção de dependencias

export async function register(req: FastifyRequest, res: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { email, name, password } = registerBodySchema.parse(req.body);

  try {
    const usersRepository = new PrismaUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    await registerUseCase.execute({ name, email, password });
  } catch (error) {
    if (error instanceof UserAlredyExists) {
      return res.status(409).send({ message: error.message });
    }

    throw error;
  }

  return res.status(201).send();
}
