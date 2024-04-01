import { FastifyInstance } from "fastify";
import { authenticate } from "./controlles/authenticate.controller";
import { register } from "./controlles/register.controller";

export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);

  app.post("/sessions", authenticate);
}
