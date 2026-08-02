import { Request, Response } from "express";
import { registerUser, loginUser, clearUsers, findUserById } from "../services/authService";
import { RegisterRequestBody } from "../types/auth";
import { prisma } from "../lib/prisma";
import { signAccessToken } from "../utils/token";
import { AppError } from "../errors/AppError";

export const register = async (
  req: Request<{}, {}, RegisterRequestBody>,
  res: Response,
) => {
  const newUser = await registerUser(req.body.email, req.body.password);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: newUser,
  });
};

export const login = async (req: Request, res: Response) => {
  const user = await loginUser(req.body.email, req.body.password);
  
  const accessToken = signAccessToken(user.id);

  return res.status(200).json({
    success: true,
    message: "Login endpoint reached",
    data: {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      accessToken
    },
  });
};

// development-only
export const deleteUsers = async (req: Request, res: Response) => {
  await clearUsers();

  return res.status(200).json({
    success: true,
    message: "All temporary users were removed",
  });
};

export const userlist = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return res.status(200).json({
    users,
  });
};

export const getCurrentUser = async(req: Request, res: Response) => {
  if (!req.auth) {
    throw new AppError(
      401,
      "Authentication required"
    );
  }

  const userId = req.auth.userId;

  const user = await findUserById(userId);

  if (!user) {
    throw new AppError(
      401,
      "Authentication is no longer valid"
    );
  }

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
    },
  });
};