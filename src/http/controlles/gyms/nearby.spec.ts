import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-uset";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Nearby Gyn (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Near Gym Montanha",
        description: null,
        phone: null,
        latitude: -29.4501373,
        longitude: -51.9932195,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Far Gym Montanha 2",
        description: null,
        phone: null,
        latitude: -29.4690253,
        longitude: -52.0944766,
      });

    const res = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -29.4501373,
        longitude: -51.9932195,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.gyms).toHaveLength(1);
    expect(res.body.gyms).toEqual([
      expect.objectContaining({
        title: "Near Gym Montanha",
      }),
    ]);
  });
});
