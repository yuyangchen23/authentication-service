const port = Number(process.env.PORT) || 3000;
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS) || 12;
const jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN ?? "15m";

if (!Number.isInteger(bcryptRounds) || bcryptRounds < 10) {
  throw new Error("Invalid BCRYPT_ROUNDS");
}

if (!jwtAccessSecret || jwtAccessSecret.length < 32) {
  throw new Error("JWT_ACCESS_SECRET must contain at least characters");
}

export const env = {
  port,
  bcryptRounds,
  nodeEnv: process.env.NODE_ENV ?? "development",
  jwtAccessSecret,
  jwtAccessExpiresIn
};