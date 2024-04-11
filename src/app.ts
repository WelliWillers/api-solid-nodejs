import fastifyJwt from "@fastify/jwt";
import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { gymsRoutes } from "./http/controlles/gyms/routes";
import { userRoutes } from "./http/controlles/users/routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
});

app.register(userRoutes);
app.register(gymsRoutes);

app.setErrorHandler((error, _, res) => {
  if (error instanceof ZodError) {
    return res.status(400).send({
      message: "Validation error",
      error: error.format(),
    });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    //TODO: here we should log to an external tool
  }

  return res.status(500).send({
    message: "Internal server error",
  });
});
