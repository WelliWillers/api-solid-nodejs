import { app } from "@/app";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Profile (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to get user profile", async () => {
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

    const res = await request(app.server)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.user).toEqual(
      expect.objectContaining({ email: "jonh@example.com" })
    );
  });
});
