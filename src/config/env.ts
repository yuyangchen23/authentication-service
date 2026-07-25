const port = Number(process.env.PORT) || 3000;
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS);

if (!Number.isInteger(bcryptRounds) || bcryptRounds < 10) {
  throw new Error("Invalid BCRYPT_ROUNDS");
}

export const env = {
  port,
  bcryptRounds,
  nodeEnv: process.env.NODE_ENV ?? "development"
};