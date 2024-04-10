import { app } from "@/app";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("Authenticate (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to authenticate", async () => {
    await request(app.server).post("/users").send({
      name: "Jonh Doe",
      email: "jonh@example.com",
      password: "1234567890",
    });

    const res = await request(app.server).post("/sessions").send({
      email: "jonh@example.com",
      password: "1234567890",
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      token: expect.any(String),
    });
  });
});
