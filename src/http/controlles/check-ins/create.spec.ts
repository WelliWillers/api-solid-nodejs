import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-uset";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Create check-in (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const gym = await prisma.gym.create({
      data: {
        title: "Star Gym Montanha",
        latitude: -29.4501373,
        longitude: -51.9932195,
      },
    });

    const res = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -29.4501373,
        longitude: -51.9932195,
      });

    expect(res.statusCode).toEqual(201);
  });
});
