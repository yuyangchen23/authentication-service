import { Request, Response } from "express";
import { registerUser, loginUser, clearUsers } from "../services/authService";
import { RegisterRequestBody } from "../types/auth";
import { prisma } from "../lib/prisma";

export const register = async (
  req: Request<{}, {}, RegisterRequestBody>, 
  res: Response
) => {
  const newUser = await registerUser(req.body.email, req.body.password);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: newUser
  });
};

export const login = async (req: Request, res: Response) => {
  const user = await loginUser(req.body.email, req.body.password);

  return res.status(200).json({
    success: true,
    message: "Login endpoint reached",
    data: {
      id: user.id,
      email: user.email
    }
  });
};

// development-only
export const deleteUsers = async (req: Request, res: Response) => {
  await clearUsers();

  return res.status(200).json({
    success: true,
    message: "All temporary users were removed"
  });
}

export const userlist = async (req: Request, res: Response) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return res.status(200).json({
    users
  });
};
