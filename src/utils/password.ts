import bcrypt from "bcrypt";
import { env } from "../config/env";

const rounds = env.bcryptRounds;

export const hashPassword = async (password: string) : Promise<string> => {
  return bcrypt.hash(password, rounds);
}

export const verifyPassword = 
  async (password: string, passwordHash: string) : Promise<boolean> => {
    return bcrypt.compare(password, passwordHash);
}

