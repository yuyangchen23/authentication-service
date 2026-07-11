import {Request, Response} from "express";

export const register = (req: Request, res: Response) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "email and password are required"
    });
  }

  console.log("User email: " + email);

  return res.status(201).json({
    success: "true",
    email: email
  });
}

export const login = (req: Request, res: Response) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "email and password are required"
    });
  }

  console.log("User email: " + email);

  return res.status(200).json({
    success: "true",
    email: "Login endpoint reached"
  });
}

