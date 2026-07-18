import { Request, Response } from "express";
import { users, findUserByEmail, createUser, verifyUserCredentials, registerUser, loginUser } from "../services/authService";
import { RegisterRequestBody } from "../types/auth";
import { isValidEmailFormat, isValidPassword } from "../utils/utils";
import { AppError } from "../errors/AppError";

export const register = (
  req: Request<{}, {}, RegisterRequestBody>, 
  res: Response
) => {
  const newUser = registerUser(req.body.email, req.body.password);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: newUser
  });
};

export const login = (req: Request, res: Response) => {
  const user = loginUser(req.body.email, req.body.password);

  return res.status(200).json({
    success: true,
    message: "Login endpoint reached",
    data: {
      id: user.id,
      email: user.email
    }
  });
};

export const userlist = (req: Request, res: Response) => {
  return res.status(200).json({
    users: users.map((user) => ({
      id: user.id,
      email: user.email
    }))
  });
};