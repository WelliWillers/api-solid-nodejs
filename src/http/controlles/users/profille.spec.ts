import { app } from "@/app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-uset";
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
    const { token } = await createAndAuthenticateUser(app);

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
