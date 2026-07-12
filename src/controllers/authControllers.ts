import { Request, Response } from "express";
import { users, findUserByEmail, createUser, verifyUserCredentials } from "../services/authService";
import { RegisterRequestBody } from "../types/auth";

export const register = (
  req: Request<{}, {}, RegisterRequestBody>, 
  res: Response
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "email and password are required"
    });
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (findUserByEmail(normalizedEmail)) {
    return res.status(409).json({
      success: false,
      message: "A user with this email already exists"
    });
  }

  const newUser = createUser(normalizedEmail, password);

  console.log("User email: " + email);

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: newUser
  });
}


export const login = (req: Request, res: Response) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(401).json({
      success: false,
      message: "email and password are required"
    });
  }

  const user = findUserByEmail(email);

  if (!verifyUserCredentials(email, password)) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  console.log("User email: " + email);

  return res.status(200).json({
    success: true,
    message: "Login endpoint reached",
    data: {
      id: user?.id,
      email: user?.email
    }
  });
}

export const userlist = (req: Request, res: Response) => {
  return res.status(200).json({
    users: users.map((user) => ({
      id: user.id,
      email: user.email
    }))
  });
}