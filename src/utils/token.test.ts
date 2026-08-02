import jwt from "jsonwebtoken";
import { describe, it, expect } from "vitest";
import { signAccessToken, verifyAccessToken } from "./token";

describe("Token utility test", () => {
  it("creates a token containing the user id", () => {
    const token = signAccessToken("user-123");
    const payload = verifyAccessToken(token);

    expect(payload.sub).toBe("user-123");
  });

  it("signAccessToken returns a string", () => {
    const token = signAccessToken("user-123");

    expect(typeof token).toBe("string");
  });

  it("rejects a token signed with another secret", () => {
    const token = jwt.sign({}, "this-is-a-different-secret-with-32-chars", {
      subject: "user-123",
      issuer: "authentication-service",
      audience: "authentication-service-client",
      expiresIn: "15m",
    });

    expect(() => verifyAccessToken(token)).toThrow();
  });

  it("rejects a malformed token", () => {
    expect(() => verifyAccessToken("not-a-valid-jwt")).toThrow();
  });

  it("rejects a expired token", () => {
    const token = jwt.sign({}, process.env.JWT_ACCESS_SECRET!, {
      subject: "user-123",
      issuer: "authentication-service",
      audience: "authentication-service-client",
      expiresIn: "-1s",
    });

    expect(() =>  verifyAccessToken(token)).toThrow();
  });
});
