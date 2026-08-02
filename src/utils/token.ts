import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../config/env";
import { AccessTokenPayload } from "../types/auth";

export const signAccessToken = (userId: string): string => {
  const options: SignOptions = {
    expiresIn: env.jwtAccessExpiresIn as SignOptions["expiresIn"],
    issuer: "authentication-service",
    audience: "authentication-service-client",
  };

  return jwt.sign({}, env.jwtAccessSecret, {
    ...options,
    subject: userId,
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = jwt.verify(token, env.jwtAccessSecret, {
    issuer: "authentication-service",
    audience: "authentication-service-client",
  });

  if (typeof decoded === "string" || typeof decoded.sub !== "string") {
    throw new Error("Invalid access token payload");
  }

  return {
    sub: decoded.sub,
  };
};
