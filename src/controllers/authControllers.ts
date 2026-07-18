import { Request, Response } from "express";
import { users, registerUser, loginUser, clearUsers } from "../services/authService";
import { RegisterRequestBody } from "../types/auth";

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

// development-only
export const deleteUsers = (req: Request, res: Response) => {
  clearUsers();

  return res.status(200).json({
    success: true,
    message: "All temporary users were removed"
  });
}

export const userlist = (req: Request, res: Response) => {
  return res.status(200).json({
    users: users.map((user) => ({
      id: user.id,
      email: user.email
    }))
  });
};