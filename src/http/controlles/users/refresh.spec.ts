import { app } from "@/app";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Refresh Token (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to refresh a token", async () => {
    await request(app.server).post("/users").send({
      name: "Jonh Doe",
      email: "jonh@example.com",
      password: "1234567890",
    });

    const res = await request(app.server).post("/sessions").send({
      email: "jonh@example.com",
      password: "1234567890",
    });

    const cookies = res.get("Set-Cookie");

    const refreshRes = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies!)
      .send();

    expect(refreshRes.statusCode).toEqual(200);
    expect(refreshRes.body).toEqual({
      token: expect.any(String),
    });
    expect(refreshRes.get("Set-Cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
