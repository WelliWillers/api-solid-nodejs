import { app } from "@/app";
import { prisma } from "@/lib/prisma";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-uset";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Validate (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to validate a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    const user = await prisma.user.findFirstOrThrow();

    const gym = await prisma.gym.create({
      data: {
        title: "Star Gym Montanha",
        latitude: -29.4501373,
        longitude: -51.9932195,
      },
    });

    let checkIn = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    });

    const res = await request(app.server)
      .patch(`/check-ins/${checkIn.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(204);
  });
});
