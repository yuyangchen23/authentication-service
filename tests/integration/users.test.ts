import "dotenv/config";
import request from "supertest";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import app from "../../src/app";
import { prisma } from "../../src/lib/prisma";

describe("Authentication integration", () => {
  beforeEach(async () => {
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("registers a user", async () => {
    const res = await request(app).post("/auth/register").send({
      email: "test@example.com",
      password: "StrongPassword123",
    });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual(
      expect.objectContaining({
        email: "test@example.com",
      }),
    );
  });

  it("login a user", async () => {
    const email = `test-${Date.now()}@example.com`;
    const password = "StrongPassword123";

    await request(app)
      .post("/auth/register")
      .send({ email, password })
      .expect(201);

    const loginRes = await request(app)
      .post("/auth/login")
      .send({ email, password })
      .expect(200)

    expect(loginRes.body.data.accessToken).toEqual(expect.any(String));
  });
  
});
