import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-uset";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Search Gyn (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to search gym", async () => {
    const { token } = await createAndAuthenticateUser(app, true);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Star Gym Montanha",
        description: "asdasdwd",
        phone: "51992618520",
        latitude: -29.4501373,
        longitude: -51.9932195,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "typescript Gym Montanha",
        description: "asdasdwd",
        phone: "51992618520",
        latitude: -29.4501373,
        longitude: -51.9932195,
      });

    const res = await request(app.server)
      .get("/gyms/search")
      .query({
        query: "typescript",
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.gyms).toHaveLength(1);
    expect(res.body.gyms).toEqual([
      expect.objectContaining({
        title: "typescript Gym Montanha",
      }),
    ]);
  });
});
