import { AppError } from "../errors/AppError";
import { isValidEmailFormat, isValidPassword } from "../utils/utils";
import { prisma } from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { hashPassword, verifyPassword } from "../utils/password";

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const createUser = async (email: string, passwordHash: string) => {
  try {
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
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

// export const verifyUserCredentials = async (email: string, password: string) => {
//   const user = await findUserByEmail(email);

//   if (!user) {
//     return false;
//   }

//   return verifyPassword(password, user.passwordHash);
// };

export const clearUsers = async () => {
  if (process.env.NODE_ENV !== "development") {
    throw new AppError(404, "Route not found");
  }

  await prisma.user.deleteMany();
};

// Use for userRoutes
export const findUserById = async(id: string) => {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true
    },
  });
};

// business logic used by controller
export const registerUser = async (email: unknown, password: unknown) => {
  if (typeof email !== "string") {
    throw new AppError(400, "Email is required");
  }

  if (
    typeof password !== "string" ||
    password.length < 10 ||
    password.length > 128 ||
    password.trim().length < 0
  ) {
    throw new AppError(
      400,
      "Password must contain between 10 and 128 characters",
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmailFormat(normalizedEmail)) {
    throw new AppError(400, "Email must be a valid email address");
  }

  if (!isValidPassword(password)) {
    throw new AppError(400, "Password must contain at least 8 characters");
  }

  const hashedPassword = await hashPassword(password);

  return createUser(normalizedEmail, hashedPassword);
};

// login user business logic
export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new AppError(401, "email and password are required");
  }

  const user = await findUserByEmail(email);

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);

  if (!passwordMatches) {
    throw new AppError(401, "Invalid email or password");
  }

  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
