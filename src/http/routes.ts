import { FastifyInstance } from "fastify";
import { register } from "./controlles/register.controller";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
}
