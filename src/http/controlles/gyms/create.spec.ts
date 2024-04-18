import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-uset";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Create Gyn (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create gym", async () => {
    const { token } = await createAndAuthenticateUser(app);

    const res = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Star Gym Montanha",
        description: "asdasdwd",
        phone: "51992618520",
        latitude: -29.4501373,
        longitude: -51.9932195,
      });

    expect(res.statusCode).toEqual(201);
  });
});
