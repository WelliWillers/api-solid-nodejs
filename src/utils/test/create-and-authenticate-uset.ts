import { FastifyInstance } from "fastify";
import request from "supertest";

export async function createAndAuthenticateUser(app: FastifyInstance) {
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
