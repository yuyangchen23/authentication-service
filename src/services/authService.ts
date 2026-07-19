import { AppError } from "../errors/AppError";
import { isValidEmailFormat, isValidPassword } from "../utils/utils";
import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email
    }
  });
};

export const createUser = async (email: string, password: string) => {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError(409, "A user with this email already exists");
    }

    throw error;
  }
};

export const verifyUserCredentials = async (email: string, password: string) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return false;
  }

  return user.password === password;
};

export const clearUsers = async () => {
  if (process.env.NODE_ENV !== "development") {
    throw new AppError(404, "Route not found")
  }

  await prisma.user.deleteMany();
}

// business logic used by controller
export const registerUser = async (email: unknown, password: unknown) => {
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

  return createUser(normalizedEmail, password);
};

// login user business logic
export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new AppError(401, "email and password are required");
  }

  const user = await findUserByEmail(email);

  if (!user || !(await verifyUserCredentials(email, password))) {
    throw new AppError(401, "Invalid email or password");
  }

  return {
    id: user.id,
    email: user.email
  }
};
