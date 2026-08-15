import "dotenv/config";
import request from "supertest";
import { describe, it, expect, beforeEach, afterAll } from "vitest";
import app from "../../src/app";
import { prisma } from "../../src/lib/prisma";
import { hashRefreshToken } from "../../src/utils/refreshToken";

const password = "StrongPassword123";

const uniqueEmail = () => {
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}@example.com`;
};

const registerAndLogin = async () => {
  const email = uniqueEmail();

  await request(app)
    .post("/auth/register")
    .send({ email, password })
    .expect(201);

  const loginRes = await request(app)
    .post("/auth/login")
    .send({ email, password })
    .expect(200);

  return {
    userId: loginRes.body.data.user.id as string,
    accessToken: loginRes.body.data.accessToken as string,
    refreshToken: loginRes.body.data.refreshToken as string,
  };
};

describe("sessions integration test", () => {
  beforeEach(async () => {
    await prisma.session.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("login creates a session", async () => {
    const { userId, refreshToken } = await registerAndLogin();
    const refreshTokenHash = hashRefreshToken(refreshToken);

    const session = await prisma.session.findUnique({
      where: { refreshTokenHash },
    });

    expect(refreshToken).toEqual(expect.any(String));
    expect(session).not.toBeNull();
    expect(session?.userId).toBe(userId);
    expect(session?.revokedAt).toBeNull();
    expect(session?.expiresAt).toBeInstanceOf(Date);
  });

  it("does not store the raw refresh token in the database", async () => {
    const { refreshToken } = await registerAndLogin();

    const rawTokenSession = await prisma.session.findFirst({
      where: {
        refreshTokenHash: refreshToken,
      },
    });

    expect(rawTokenSession).toBeNull();
  });

  it("refreshes with a valid refresh token", async () => {
    const { refreshToken } = await registerAndLogin();

    const refreshRes = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken })
      .expect(200);

    expect(refreshRes.body.data.accessToken).toEqual(expect.any(String));
    expect(refreshRes.body.data.refreshToken).toEqual(expect.any(String));
    expect(refreshRes.body.data.refreshToken).not.toBe(refreshToken);
  });

  it("revokes the old session and links it to the replacement session during refresh", async () => {
    const { userId, refreshToken } = await registerAndLogin();
    const oldRefreshTokenHash = hashRefreshToken(refreshToken);

    const refreshRes = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken })
      .expect(200);

    const newRefreshToken = refreshRes.body.data.refreshToken as string;
    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);

    const oldSession = await prisma.session.findUnique({
      where: { refreshTokenHash: oldRefreshTokenHash },
    });

    const newSession = await prisma.session.findUnique({
      where: { refreshTokenHash: newRefreshTokenHash },
    });

    expect(oldSession?.revokedAt).toBeInstanceOf(Date);
    expect(oldSession?.replacedBySessionId).toBe(newSession?.id);
    expect(newSession?.userId).toBe(userId);
    expect(newSession?.revokedAt).toBeNull();
  });

  it("rejects an old refresh token after rotation", async () => {
    const { refreshToken } = await registerAndLogin();

    await request(app)
      .post("/auth/refresh")
      .send({ refreshToken })
      .expect(200);

    await request(app)
      .post("/auth/refresh")
      .send({ refreshToken })
      .expect(401);
  });

  it("revokes the active replacement session when an old rotated token is reused", async () => {
    const { refreshToken } = await registerAndLogin();

    const refreshRes = await request(app)
      .post("/auth/refresh")
      .send({ refreshToken })
      .expect(200);

    const replacementToken = refreshRes.body.data.refreshToken as string;

    await request(app)
      .post("/auth/refresh")
      .send({ refreshToken })
      .expect(401);

    await request(app)
      .post("/auth/refresh")
      .send({ refreshToken: replacementToken })
      .expect(401);
  });

  it("rejects refresh requests without a refresh token", async () => {
    await request(app)
      .post("/auth/refresh")
      .send({})
      .expect(401);
  });

  it("logout revokes the current session", async () => {
    const { refreshToken } = await registerAndLogin();

    await request(app)
      .post("/auth/logout")
      .send({ refreshToken })
      .expect(200);

    const session = await prisma.session.findUnique({
      where: {
        refreshTokenHash: hashRefreshToken(refreshToken),
      },
    });

    expect(session?.revokedAt).toBeInstanceOf(Date);
  });

  it("logout-all revokes all sessions for the user", async () => {
    const email = uniqueEmail();

    await request(app)
      .post("/auth/register")
      .send({ email, password })
      .expect(201);

    const firstLoginRes = await request(app)
      .post("/auth/login")
      .send({ email, password })
      .expect(200);

    await request(app)
      .post("/auth/login")
      .send({ email, password })
      .expect(200);

    const refreshToken = firstLoginRes.body.data.refreshToken as string;
    const userId = firstLoginRes.body.data.user.id as string;

    await request(app)
      .post("/auth/logout-all")
      .send({ refreshToken })
      .expect(200);

    const sessions = await prisma.session.findMany({
      where: { userId },
    });

    expect(sessions).toHaveLength(2);
    expect(sessions.every((session) => session.revokedAt instanceof Date)).toBe(true);
  });
});
