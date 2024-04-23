import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false
) {
  const user = await prisma.user.create({
    data: {
      name: "Jonh Doe",
      email: "jonh@example.com",
      password_hash: await hash("1234567890", 6),
      role: isAdmin ? "ADMIN" : "MEMBER",
    },
  });

  await request(app.server).post("/users").send({
    name: "Jonh Doe",
    email: "jonh@example.com",
    password: "1234567890",
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "jonh@example.com",
    password: "1234567890",
  });

  const { token } = authResponse.body;

  return { token };
}
