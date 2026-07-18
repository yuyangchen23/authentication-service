import { AppError } from "../errors/AppError";
import { v4 as uuidv4 } from "uuid";
import { User, PublicUser } from "../types/user";
import { isValidEmailFormat, isValidPassword } from "../utils/utils";

export const users: User[] = [];

export const findUserByEmail = (email: string) => {
  for (const user of users) {
    if (user.email === email) {
      return user;
    }
  }
};

export const createUser = (email: string, password: string) => {
  if (findUserByEmail(email)) {
    return null;
  }

  const newUser: User = {
    id: uuidv4(),
    email,
    password,
  };

  users.push(newUser);

  const publicUser: PublicUser = {
    id: newUser.id,
    email: newUser.email,
  };

  return publicUser;
};

export const verifyUserCredentials = (email: string, password: string) => {
  const user = findUserByEmail(email);

  if (!user) {
    return false;
  }

  return user.password === password;
};

export const clearUsers = (): void => {
  users.length = 0;
}

// business logic used by controller
export const registerUser = (email: unknown, password: unknown) => {
  if (typeof email !== "string" || typeof password !== "string") {
    throw new AppError(400, "Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmailFormat(normalizedEmail)) {
    throw new AppError(400, "Email must be a valid email address");
  }

  if (!isValidPassword(password)) {
    throw new AppError(400, "Password must contain at least 8 characters");
  }

  if (findUserByEmail(normalizedEmail)) {
    throw new AppError(409, "A user with this email already exists");
  }

  return createUser(normalizedEmail, password);
};

// login user business logic
export const loginUser = (email: string, password: string) => {
  if (!email || !password) {
    throw new AppError(401, "email and password are required");
  }

  const user = findUserByEmail(email);

  if (!user || !verifyUserCredentials(email, password)) {
    throw new AppError(401, "Invalid email or password");
  }

  return {
    id: user.id,
    email: user.email
  }
};
